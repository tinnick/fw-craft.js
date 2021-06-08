import * as d3 from 'd3';

enum JankenChoiceEnum {
  ROCK = 'rock',
  SCISSOR = 'scissor',
  PAPER = 'paper'
}

const JankenChoiceToNumberMap: Record<number, JankenChoiceEnum> = {
  1: JankenChoiceEnum.ROCK,
  2: JankenChoiceEnum.SCISSOR,
  3: JankenChoiceEnum.PAPER,
}

enum ActorEnum {
  USER,
  COMPUTER
}


document.querySelector('.choice__rock').addEventListener('click', () => selectChoice(JankenChoiceEnum.ROCK));
document.querySelector('.choice__scissor').addEventListener('click', () => selectChoice(JankenChoiceEnum.SCISSOR));
document.querySelector('.choice__paper').addEventListener('click', () => selectChoice(JankenChoiceEnum.PAPER));
document.querySelector('.reset-count').addEventListener('click', () => resetCount());


let winCount: number = 0;
let loseCount: number = 0;

const resultTextElement = document.querySelector('.janken-result .result-text');
const winCountElement = document.querySelector('.janken-result .win-count');
const loseCountElement = document.querySelector('.janken-result .lose-count');

function selectChoice(userChoice: JankenChoiceEnum): void {
  const templates: Record<JankenChoiceEnum, HTMLImageElement> = {
    [JankenChoiceEnum.ROCK]: () => document.querySelector('.rock-template').content.cloneNode(true),
    [JankenChoiceEnum.SCISSOR]: () => document.querySelector('.scissor-template').content.cloneNode(true),
    [JankenChoiceEnum.PAPER]: () => document.querySelector('.paper-template').content.cloneNode(true)
  }

  const userChoiceElement = document.querySelector('.user-choice');
  const computerChoiceElement = document.querySelector('.computer-choice');

  const computerChoice = getComputerChoice();

  userChoiceElement.replaceChild(templates[userChoice].call(), userChoiceElement.firstElementChild);
  computerChoiceElement.replaceChild(templates[computerChoice].call(), computerChoiceElement.firstElementChild);

  const winner = JanKenPon(userChoice, computerChoice);

  if (winner === ActorEnum.USER) {
    // handle win

    winCount++;

    winCountElement.innerText = winCount;
    resultTextElement.innerText = 'WIN!';
  } else if (winner === ActorEnum.COMPUTER) {
    // handle lose

    loseCount++;

    loseCountElement.innerText = loseCount;
    resultTextElement.innerText = 'LOSE!';
  } else {
    // handle tie

    resultTextElement.innerText = 'TIE. TRY AGAIN!';
  }
}

function resetCount(): void {
  winCount = 0;
  loseCount = 0;

  winCountElement.innerText = winCount;
  loseCountElement.innerText = loseCount;
  resultTextElement.innerText = 'CHOOSE A HAND';
}

function JanKenPon(userChoice: JankenChoiceEnum, computerChoice: JankenChoiceEnum): ActorEnum | null {
  // handle jankenpon

  switch (userChoice) {
    case JankenChoiceEnum.ROCK: {
      if (computerChoice === JankenChoiceEnum.SCISSOR) return ActorEnum.USER;
      if (computerChoice === JankenChoiceEnum.PAPER) return ActorEnum.COMPUTER;
      return null;
    }

    case JankenChoiceEnum.SCISSOR: {
      if (computerChoice === JankenChoiceEnum.PAPER) return ActorEnum.USER;
      if (computerChoice === JankenChoiceEnum.ROCK) return ActorEnum.COMPUTER;
      return null;
    }

    case JankenChoiceEnum.PAPER: {
      if (computerChoice === JankenChoiceEnum.ROCK) return ActorEnum.USER;
      if (computerChoice === JankenChoiceEnum.SCISSOR) return ActorEnum.COMPUTER;
      return null;
    }
  }
}

function getComputerChoice(): JankenChoiceEnum {
  return JankenChoiceToNumberMap[ Math.ceil(Math.random() * 3) ];
}

async function testComputerChoiceRatio(): void {

  const choices: Record<JankenChoiceEnum, number> = {
    [JankenChoiceEnum.ROCK]: 0,
    [JankenChoiceEnum.SCISSOR]: 0,
    [JankenChoiceEnum.PAPER]: 0
  };


  for await (const choice of generateComputerChoices(100)) {
    choices[choice]++;
  }

  const datumContainer = document.querySelector('.opponent-ratio__graph');

  d3.select(datumContainer)
    .selectAll('div')
    .data(Object.entries(choices))
    .enter()
    .append('div')
    .style('height', ([_, count]) => count + '%')
    .text(([choice, count]) => `${choice} ${count}%`);

}

async function* generateComputerChoices(limit: number): IterableIterator<JankenChoiceEnum> {
  let count: number = 0;

  while (count !== limit) {
    yield getComputerChoice();
    count++;
  }
}

testComputerChoiceRatio();
