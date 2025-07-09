// https://deckofcardsapi.com/

class DeckData {
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
    return {success}
  }

  async shuffleDeckOnly() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/shuffle/?remaining=true`)
    const data = await response.json()
    this.#remaining = data.remaining
    this.#shuffled = data.shuffled

    if (this.#debug_mode)
      return data
    return {success}
  }

  async drawCard(pile_name=null) {
    const data = await this.drawCards(1, pile_name)
    if (this.#debug_mode)
      return data
    return data[0]
  }

  async drawCards(amount, pile_name) {
    const response = (!pile_name)
      ? await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/draw/?count=${amount}`)
      : await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/pile/${pile_name}/draw/?count=${amount}`)
    const data = await response.json()
    if (pile_name)
      this.#piles = data.piles
    this.#remaining = data.remaining

    if (this.#debug_mode)
      return data
    return data.cards
  }

  async addToPile(pile_name, card_codes) {
    const card_codes_as_str = (Array.isArray(card_codes)) ? card_codes.join(",") : card_codes
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/pile/${pile_name}/add/?cards=${card_codes_as_str}`)
    const data = await response.json()
    this.#piles = data.piles

    if (this.#debug_mode)
      return data
    return {success}
  }

  async shufflePile(pile_name) {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/pile/${pile_name}/shuffle/`)
    const data = await response.json()
    this.#piles = data.piles

    if (this.#debug_mode)
      return data
    return {success}
  }

  async returnCards() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/return/`)
    const data = await response.json()
    this.#remaining = data.remaining
    this.#shuffled = data.shuffled

    if (this.#debug_mode)
      return data
    return {success}
  }

  async returnPile(pile_name) {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.#deck_id}/pile/${pile_name}/return/`)
    const data = await response.json()
    this.#remaining = data.remaining
    this.#shuffled = data.shuffled
    this.#piles = data.piles

    if (this.#debug_mode)
      return data
    return {success}
  }
}


export default async function getDeck() {
  const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  const data = await response.json()
  const Deck = new DeckData(data)
  return Deck
}
