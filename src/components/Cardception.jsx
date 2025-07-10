import { useState, useEffect } from 'react'
import getDeck from '../DeckOfCards'


export default function Cardception() {
  const [Deck, setDeck] = useState(null)
  const [card, setCard] = useState({})
  const [cardStyle, setCardStyle] = useState(null)

  // setup
  useEffect(() => {
    async function fetchDeck() {
      setDeck(await getDeck())
    }
    fetchDeck()
  }, [])

  useEffect(() => {
    getCard()
  }, [Deck])

  // state setters
  async function getCard() {
    let card
    try {
      card = await Deck.drawCard()
    }
    catch (error) {
      await Deck.shuffleDeck()
      card = await Deck.drawCard()
    }
    setCard(card)
    setCardStyle({backgroundImage: `url(${card.images.svg})`})
  }

  // handlers for user interaction
  function handleClick() {
    getCard()
  }
  
  // React component
  return (
    <div>
      <div
        onClick={handleClick}
        className={`card ${card.code}`}
        style={cardStyle}
      ></div>
    </div>
  )
}