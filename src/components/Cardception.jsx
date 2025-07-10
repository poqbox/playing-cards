import { useState, useEffect } from 'react'
import getDeck from '../DeckOfCards'


export default function Cardception() {
  const [Deck, setDeck] = useState(null)
  const [card, setCard] = useState({images: {svg: ""}})

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
    try {
      setCard(await Deck.drawCard())
    }
    catch (error) {
      await Deck.shuffleDeck()
      setCard(await Deck.drawCard())
    }
  }

  // handlers for user interaction
  function handleClick() {
    getCard()
  }
  
  // React component
  return (
    <div>
      <div className='card' onClick={handleClick}>
        <img
          className={`${card.code}`}
          src={card.images.svg}
        />
      </div>
    </div>
  )
}