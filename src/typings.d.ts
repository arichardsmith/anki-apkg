interface CardTemplate {
  question: string,
  answer: string,
  name?: string
}

interface DeckConfig {
  id?: number
  name: string
  card: {
    fields: Array<string>
    template: CardTemplate | Array<CardTemplate>
    styleText?: string
  }
}

interface Card {
  timestamp?: number,
  content: Array<string>,
  tags: Array<string>
}
