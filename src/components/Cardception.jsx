import { useState, useEffect } from 'react'
import getDeck from '../DeckOfCards'


export default function Cardception() {
  const [Deck, setDeck] = useState(null)
  const [ForegroundCard, setForegroundCard] = useState({})
  const [ForegroundCardStyle, setForegroundCardStyle] = useState(null)
  const [BackgroundCard, setBackgroundCard] = useState({})
  const [backgroundCardStyle, setBackgroundCardStyle] = useState(null)
  const [drawingCard, setDrawingCard] = useState(false)

  // setup
  useEffect(() => {
    async function fetchDeck() {
      setDeck(await getDeck())
    }
    fetchDeck()
  }, [])

  useEffect(() => {
    async function getFirstCard() {
      let card = await Deck.drawCard()
      setForegroundCard(card)
      setForegroundCardStyle({
        backgroundImage: `url(${card.images.svg})`,
        backgroundSize: "60%"
      })
    }
    getFirstCard()
  }, [Deck])

  // state setters
  function startCardception() {
    const duration = 4000
    const max_card_size = "8000%"

    setForegroundCardStyle({
      ...ForegroundCardStyle,
      backgroundSize: max_card_size,
      transitionProperty: "background-size",
      transitionDuration: `${duration/1000}s`,
      transitionTimingFunction: "ease-in"
    })
    setTimeout(() => {
      setForegroundCardStyle({})
      setBackgroundCard(ForegroundCard)
      setBackgroundCardStyle({
        backgroundImage: ForegroundCardStyle.backgroundImage,
        backgroundSize: max_card_size
      })
      getCard()
    }, duration)
  }

  async function getCard() {
    const duration = 6000
    let card
    try {
      card = await Deck.drawCard()
    }
    catch (error) {
      await Deck.shuffleDeck()
      card = await Deck.drawCard()
    }
    setDrawingCard(false)
    setForegroundCard(card)
    setForegroundCardStyle({
      backgroundImage: `url(${card.images.svg})`,
      backgroundSize: "60%",
      transitionProperty: "background-size",
      transitionDuration: `${duration/1000}s`,
      transitionTimingFunction: "ease-in-out"
    })
  }

  // handlers for user interaction
  function handleClick() {
    setDrawingCard(true)
    startCardception()
  }
  
  // React component
  return (
    <div className={`background ${ForegroundCard.code}`} style={backgroundCardStyle}>
      <div
        onClick={(drawingCard) ? null : handleClick}
        className={`card ${ForegroundCard.code}`}
        style={ForegroundCardStyle}
      ></div>
    </div>
  )
}