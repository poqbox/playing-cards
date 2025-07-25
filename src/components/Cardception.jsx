import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import getDeck from '../DeckOfCards'


export default function Cardception() {
  const params = useParams()

  const pile_name = "cardception"
  const [DeckData, setDeck] = useState(null)
  const [CardPile, setCardPile] = useState(null)
  const [ForegroundCard, setForegroundCard] = useState({})
  const [ForegroundCardStyle, setForegroundCardStyle] = useState(null)
  const [BackgroundCard, setBackgroundCard] = useState({})
  const [backgroundCardStyle, setBackgroundCardStyle] = useState(null)
  const [drawingCard, setDrawingCard] = useState(false)
  const [transition, setTransition] = useState({timeoutId: undefined, clearTransitions: function () {clearTimeout(this.timeoutId)}})
  const [tooltip, setTooltip] = useState(null)

  // setup
  useEffect(() => {
    async function fetchDeck() {
      setDeck(await getDeck())
    }
    fetchDeck()
  }, [])

  useEffect(() => {
    // format the path params data
    if (params.card_code)
      params.card_code = params.card_code.toUpperCase()
    createPile()

    async function createPile() {
      await DeckData.shuffleDeck()
      await DeckData.drawCards(52)
      await DeckData.addToPile(pile_name, DeckData.getCardCodes())
      await DeckData.shufflePile(pile_name)
      setCardPile(DeckData.getPiles()[pile_name])
    }
  }, [DeckData, params])

  useEffect(() => {
    transition.clearTransitions()
    getFirstCard()

    async function getFirstCard() {
      setForegroundCardStyle({})
      let card = (await DeckData.getCardCodes().includes(params.card_code))
        ? getCard(params.card_code)
        : getCard()
    }
  }, [CardPile])

  // state setters
  function startCardception() {
    const duration = 4000
    let max_card_size
    switch (ForegroundCard.code) {
      case "JC":
        max_card_size = "1000000%"
        break
      case "JH":
        max_card_size = "24000%"
        break
      case "QC":
        max_card_size = "20000%"
        break
      case "QH":
        max_card_size = "100000%"
        break
      case "KC":
        max_card_size = "100000%"
        break
      case "KD":
        max_card_size = "40000%"
        break
      case "KH":
        max_card_size = "40000%"
        break
      case "KS":
        max_card_size = "40000%"
        break
      default:
        max_card_size = "6000%"
    }

    setForegroundCardStyle({
      ...ForegroundCardStyle,
      backgroundSize: max_card_size,
      transitionProperty: "background-size",
      transitionDuration: `${duration/1000}s`,
      transitionTimingFunction: "ease-in"
    })
    transition.timeoutId = setTimeout(() => {
      setForegroundCardStyle({})
      setBackgroundCard(ForegroundCard)
      setBackgroundCardStyle({
        backgroundImage: ForegroundCardStyle.backgroundImage,
        backgroundSize: max_card_size
      })
      getCard()
    }, duration)
  }

  async function getCard(card_code=undefined) {
    const duration1 = 4000
    const duration2 = 4000
    let card
    try {
      (await DeckData.getCardCodes().includes(card_code))
        ? card = await DeckData.drawFromPile(pile_name, card_code)
        : card = await DeckData.drawCard(pile_name)
    }
    catch (error) {
      await DeckData.addToPile(pile_name, DeckData.getCardCodes())
      await DeckData.shufflePile(pile_name)
      (await DeckData.getCardCodes().includes(card_code))
        ? card = await DeckData.drawFromPile(pile_name, card_code)
        : card = await DeckData.drawCard(pile_name)
    }
    CardPile.remaining = DeckData.getPiles()[pile_name].remaining
    setDrawingCard(false)
    setForegroundCard(card)
    setForegroundCardStyle({
      backgroundImage: `url(${card.images.svg})`,
      backgroundSize: "2%",
      transitionProperty: "background-size",
      transitionDuration: `${duration1/1000}s`,
      transitionTimingFunction: "ease-in"
    })
    transition.timeoutId = setTimeout(() => {
      setForegroundCardStyle({
        backgroundImage: `url(${card.images.svg})`,
        backgroundSize: "80%",
        transitionProperty: "background-size",
        transitionDuration: `${duration2/1000}s`,
        transitionTimingFunction: "cubic-bezier(1,.03,.3,1)"
      })
      if (CardPile.remaining > 50) {
        transition.timeoutId = setTimeout(() => {
          setTooltip("Click to begin Cardception")
        }, duration2)
      }
    }, duration1)
  }

  // handlers for user interaction
  function handleClick() {
    transition.clearTransitions()
    setTooltip(null)
    setDrawingCard(true)
    startCardception()
  }
  
  // React component
  return (
    <div className={`background ${BackgroundCard.code}`} style={backgroundCardStyle}>
      <div
        title={tooltip}
        onClick={(drawingCard) ? null : handleClick}
        className={`card ${ForegroundCard.code}`}
        style={ForegroundCardStyle}
      ></div>
    </div>
  )
}
