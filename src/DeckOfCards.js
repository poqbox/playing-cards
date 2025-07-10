// https://deckofcardsapi.com/

class DeckData {
  static card_codes = [
    'AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '0C', 'JC', 'QC', 'KC',
    'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '0D', 'JD', 'QD', 'KD',
    'AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '0H', 'JH', 'QH', 'KH',
    'AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '0S', 'JS', 'QS', 'KS'
  ]

  #deck_id
  #remaining
  #shuffled
  #piles = null
  #card_back_url = "https://www.deckofcardsapi.com/static/img/back.png"
  #debug_mode

  constructor(deck, debug_mode=false) {
    this.#deck_id = deck.deck_id
    this.#remaining = deck.remaining
    this.#shuffled = deck.shuffled
    this.#debug_mode = debug_mode
  }

  getCardCodes() { return DeckData.card_codes}
  getRemaining() { return this.#remaining }
  getShuffled() { return this.#shuffled }
  getPiles() { return this.#piles }
  getCardBackUrl() { return this.#card_back_url }

  enableDebugMode() {
    this.#debug_mode = true
  }
  disableDebugMode() {
    this.#debug_mode = false
  }
  toggleDebugMode() {
    this.#debug_mode = !this.#debug_mode
  }

  async shuffleDeck() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/shuffle/`)
    const data = await response.json()
    this.#remaining = data.remaining
    this.#shuffled = data.shuffled

    if (this.#debug_mode)
      return data
    return data.success
  }

  async shuffleDeckOnly() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/shuffle/?remaining=true`)
    const data = await response.json()
    this.#remaining = data.remaining
    this.#shuffled = data.shuffled

    if (this.#debug_mode)
      return data
    return data.success
  }

  async drawCard(pile_name=null) {
    const data = await this.drawCards(1, pile_name)
    if (this.#debug_mode)
      return data
    return data[0]
  }

  async drawCards(amount, pile_name=null) {
    const response = (!pile_name)
      ? await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/draw/?count=${amount}`)
      : await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/pile/${pile_name}/draw/?count=${amount}`)
    const data = await response.json()
    if (pile_name)
      this.#piles = data.piles
    this.#remaining = data.remaining

    if (this.#debug_mode)
      return data
    else if (data.success)
      return data.cards
    else
      throw data.error
  }

  async addToPile(pile_name, card_codes) {
    const card_codes_as_str = (Array.isArray(card_codes)) ? card_codes.join(",") : card_codes
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/pile/${pile_name}/add/?cards=${card_codes_as_str}`)
    const data = await response.json()
    this.#piles = data.piles

    if (this.#debug_mode)
      return data
    return data.success
  }

  async shufflePile(pile_name) {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/pile/${pile_name}/shuffle/`)
    const data = await response.json()
    this.#piles = data.piles

    if (this.#debug_mode)
      return data
    return data.success
  }

  async drawFromPile(pile_name, card_codes) {
    const card_codes_as_str = (Array.isArray(card_codes)) ? card_codes.join(",") : card_codes
    const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${this.#deck_id}/pile/${pile_name}/draw/?cards=${card_codes_as_str}`)
    const data = await response.json()
    this.#piles = data.piles

    if (this.#debug_mode)
      return data
    else if (data.success) {
      const cards = data.cards
      if (cards.length === 1)
        return cards[0]
      return data.cards
    }
    else
      throw data.error
  }

  async returnCards() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/return/`)
    const data = await response.json()
    this.#remaining = data.remaining
    this.#shuffled = data.shuffled

    if (this.#debug_mode)
      return data
    return data.success
  }

  async returnPile(pile_name) {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/pile/${pile_name}/return/`)
    const data = await response.json()
    this.#remaining = data.remaining
    this.#shuffled = data.shuffled
    this.#piles = data.piles

    if (this.#debug_mode)
      return data
    return data.success
  }
}


export default async function getDeck() {
  const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  const data = await response.json()
  const Deck = new DeckData(data)
  return Deck
}
