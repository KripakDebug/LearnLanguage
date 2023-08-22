import React, { useContext, useEffect, useState } from "react";
import { informationWithFirebase } from "../index";
import { Button, Form, Input, Modal, Select, Switch } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  FormOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RocketOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import uuid from "react-uuid";
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink, useNavigate } from "react-router-dom";
const { confirm } = Modal;
export function ModalCreateCard({
  isModalCreateCardOpen,
  setIsModalCreateCardOpen,
  deck,
  setIsModalOpenList,
  setDeck,
}) {
  const { firestore, firebase } = useContext(informationWithFirebase);
  const [wordCard, setWordCard] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  return (
    <div>
      <Modal
        footer={null}
        className="modal"
        open={isModalCreateCardOpen}
        onCancel={toggleModal}
        autoComplete="off"
        initialValues={{
          WORD: wordCard,
          DEFINITION: definition,
          EXAMPLE: example,
        }}
      >
        <h2>Add card to {deck.nameDeck}</h2>
        <Form layout={"vertical"} onFinish={onSubmit} autoComplete="off">
          <Form.Item
            label="WORD"
            name="WORD"
            rules={[
              {
                required: true,
                message: "Please input memorize!",
              },
            ]}
          >
            <Input
              placeholder="memorize"
              onChange={(e) => setWordCard(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="DEFINITION"
            name="DEFINITION"
            rules={[
              {
                required: true,
                message: "Please input definition!",
              },
            ]}
          >
            <Input
              placeholder="to learn by heart, commit to memory"
              onChange={(e) => setDefinition(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="EXAMPLE (OPTIONAL)"
            name="EXAMPLE"
            tooltip={{
              icon: (
                <InfoCircleOutlined
                  onClick={() =>
                    info(
                      "Additional:",
                      <p>
                        Additional item will be shown at the last of the each
                        card. This is a good place to provide supplement
                        information. (e.g. example sentence of an English word)
                      </p>
                    )
                  }
                />
              ),
            }}
          >
            <Input
              placeholder="He memorized thousands of verses."
              onChange={(e) => setExample(e.target.value)}
            />
          </Form.Item>
          <Button type="default" htmlType="submit">
            Add
          </Button>
        </Form>
      </Modal>
    </div>
  );
  function onSubmit() {
    firestore
      .collection("decks")
      .where("id", "==", deck.id)
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          const docRef = firestore.collection("decks").doc(doc.id);
          const cardsArray = doc.data().cards || [];

          const newCard = {
            idCard: uuid(),
            wordCard: wordCard,
            definition: definition,
            example: example === "" ? "" : example,
            createAt: firebase.firestore.Timestamp.fromDate(new Date()),
            lastTested: null,
            nextTest: null,
            testCnt: 0,
            estIntervalDays: 0,
            failCnt: 0,
          };

          cardsArray.push(newCard);

          docRef.update({
            cards: cardsArray,
          });
        });
      });
    toggleModal();
  }

  function toggleModal() {
    setIsModalOpenList(false);
    setDeck(null);
    setIsModalCreateCardOpen((prevState) => !prevState);
  }
}

export function ModalCreateDeck({
  isModalOpen,
  setIsModalOpen,
  deck,
  setDeck,
}) {
  const {
    nameDeck,
    flashcardDeck,
    flashcardReverseDeck,
    typingDeck,
    languageLearningDeck,
    randomOrderDeck,
    textSpeechDeck,
    languageDeck,
  } = deck || {};
  const { auth, firestore } = useContext(informationWithFirebase);
  const [user] = useAuthState(auth);
  const [name, setName] = useState(nameDeck || "");
  const [isFlashcard, setIsFlashcard] = useState(
    flashcardDeck === undefined ? true : flashcardDeck
  );
  const [isFlashcardReverse, setIsFlashcardReverse] = useState(
    !!flashcardReverseDeck
  );
  const [isTyping, setIsTyping] = useState(!!typingDeck);
  const [isLanguageLearning, setIsLanguageLearning] = useState(
    !!languageLearningDeck
  );
  const [isRandomOrder, setIsRandomOrder] = useState(!!randomOrderDeck);
  const [isLanguage, setIsLanguage] = useState(languageDeck || "English");
  const [isTextSpeech, setIsTextSpeech] = useState(!!textSpeechDeck);

  return (
    <Modal
      title="Create New Deck"
      footer={null}
      className="modal"
      open={isModalOpen}
      onCancel={toggleModal}
    >
      <Form
        layout={"vertical"}
        initialValues={{
          Name: name,
        }}
        onFinish={onSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="Name"
          rules={[
            {
              required: true,
              message: "Please input name card!",
            },
          ]}
        >
          <Input
            defaultValue={name}
            placeholder="Name the new deck"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <div className="title">
            QUIZ TYPE
            <InfoCircleOutlined
              onClick={() =>
                info(
                  "Quiz Type:",
                  <div>
                    <p>
                      This determines the format of the quiz in the learning
                      session. If multiple quiz types are selected, each quiz
                      type will be selected randomly in one learning session.
                    </p>
                    <br />
                    <p>
                      - Flaschard: The text will be presented in [Front > Back >
                      Additional] order.
                    </p>
                    <br />
                    <p>
                      - Flaschard Reverse: The text will be presented in [Back >
                      Front > Additional] order.
                    </p>
                    <br />
                    <p>
                      - Typing: The text will be presented in [Back > Front >
                      Additional] order, but you have to type in the Front text.
                    </p>
                  </div>
                )
              }
            />
          </div>

          <ul className="list">
            <li>
              Flashcard
              <Switch
                checked={isFlashcard}
                onChange={(e) => {
                  if (isFlashcardReverse === false && isTyping === false) {
                    setIsFlashcard(true);
                  } else {
                    setIsFlashcard(e);
                  }
                }}
              />
            </li>
            <li>
              Flashcard Reverse
              <Switch
                checked={isFlashcardReverse}
                onChange={(e) => {
                  if (isFlashcard === false && isTyping === false) {
                    setIsFlashcardReverse(true);
                  } else {
                    setIsFlashcardReverse(e);
                  }
                }}
              />
            </li>
            <li>
              Typing
              <Switch
                checked={isTyping}
                onChange={(e) => {
                  if (isFlashcard === false && isFlashcardReverse === false) {
                    setIsTyping(true);
                  } else {
                    setIsTyping(e);
                  }
                }}
              />
            </li>
          </ul>
        </Form.Item>
        <Form.Item>
          <div className="title">ADDITIONAL</div>
          <ul className="list">
            <li>
              <div>
                For language learning?
                <InfoCircleOutlined
                  onClick={() =>
                    info(
                      "For language learning:",
                      <p>
                        By enabling this setting, you will have access to
                        text-to-speech feature (plus dictionary feature for
                        English and Spanish).
                      </p>
                    )
                  }
                />
              </div>
              <Switch
                checked={isLanguageLearning}
                onChange={(e) => setIsLanguageLearning(e)}
              />
            </li>
            {isLanguageLearning && (
              <div>
                <Select
                  defaultValue="English"
                  value={isLanguage}
                  onChange={(e) => {
                    setIsLanguage(e);
                  }}
                  style={{
                    width: 200,
                    marginBottom: 20,
                  }}
                  options={[
                    {
                      options: [
                        {
                          label: "English",
                          value: "English",
                        },
                        {
                          label: "Korean",
                          value: "Korean",
                        },
                      ],
                    },
                  ]}
                />
                <li>
                  Text-to-speech:
                  <Switch
                    checked={isTextSpeech}
                    onChange={(e) => setIsTextSpeech(e)}
                  />
                </li>
              </div>
            )}
            <li>
              <div>
                Random Order
                <InfoCircleOutlined
                  onClick={() =>
                    info(
                      "Random Order:",
                      <p>
                        When you start a learning session, the cards will be
                        shuffled and displayed in a random order.
                      </p>
                    )
                  }
                />
              </div>
              <Switch
                checked={isRandomOrder}
                onChange={(e) => setIsRandomOrder(e)}
              />
            </li>
          </ul>
        </Form.Item>
        <div className="modal-btns">
          {deck !== null ? (
            <div className="modal-list-btn">
              <Button type="link" onClick={showDeleteConfirm}>
                <DeleteOutlined /> Delete deck
              </Button>
              <Button type="default" htmlType="submit">
                Save
              </Button>
            </div>
          ) : (
            <Button
              disabled={name === "" && true}
              type="default"
              className="btn-create-deck"
              htmlType="submit"
            >
              Create
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );

  function showDeleteConfirm() {
    confirm({
      title: "Are you sure delete this deck?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteDeck();
      },
      onCancel() {
        toggleModal();
      },
    });
  }

  function deleteDeck() {
    firestore
      .collection("decks")
      .where("id", "==", deck.id)
      .get()
      .then((data) => {
        data.docs.forEach((doc) => {
          const docRef = firestore.collection("decks").doc(doc.id);
          docRef.delete();
        });
      });
    toggleModal();
  }

  function onSubmit() {
    if (deck !== null) {
      firestore
        .collection("decks")
        .where("id", "==", deck.id)
        .get()
        .then((data) => {
          data.docs.forEach((doc) => {
            const docRef = firestore.collection("decks").doc(doc.id);
            docRef.update({
              nameDeck: name,
              flashcardDeck: isFlashcard,
              flashcardReverseDeck: isFlashcardReverse,
              typingDeck: isTyping,
              languageLearningDeck: isLanguageLearning,
              randomOrderDeck: isRandomOrder,
              languageDeck: isLanguage,
              textSpeechDeck: isTextSpeech,
            });
          });
        });
    } else {
      firestore.collection("decks").add({
        id: uuid(),
        userId: user.uid,
        nameDeck: name,
        cards: [],
        flashcardDeck: isFlashcard,
        flashcardReverseDeck: isFlashcardReverse,
        typingDeck: isTyping,
        languageLearningDeck: isLanguageLearning,
        randomOrderDeck: isRandomOrder,
        languageDeck: isLanguage,
        textSpeechDeck: isTextSpeech,
      });
    }
    setName("");
    setIsFlashcard(false);
    setIsFlashcardReverse(false);
    setIsTyping(false);
    setIsLanguageLearning(false);
    setIsRandomOrder(false);
    setIsTextSpeech(false);
    setDeck(null);
    toggleModal();
  }
  function toggleModal() {
    setDeck(null);
    setIsModalOpen((prevState) => !prevState);
  }
}

export function ModalList({
  isModalOpenList,
  setIsModalOpenList,
  setIsModalCreateCardOpen,
  setIsModalOpen,
  deck,
  setCardsLearnForDecks,
  setIsModalListCardsLearn,
  setDeck,
}) {
  const { cards } = deck;
  const cardsEstIntervalDays = cards.find((item) => {
    return item.estIntervalDays === 0 || item.estIntervalDays > 0;
  });

  return (
    <Modal
      footer={null}
      closable={null}
      className="modal"
      open={isModalOpenList}
      onCancel={toggleModal}
    >
      <ul className="modal-list">
        {cardsEstIntervalDays && (
          <li>
            <button
              onClick={() => {
                toggleModal();
                setCardsLearnForDecks([deck]);
                setIsModalListCardsLearn(true);
              }}
            >
              <RocketOutlined /> Start Learning
            </button>
          </li>
        )}
        <li>
          <button
            onClick={() => {
              setIsModalCreateCardOpen(true);
            }}
          >
            <PlusOutlined /> Add Card
          </button>
        </li>
        {cards.length ? (
          <li>
            <button
              onClick={() => {
                toggleModal();
              }}
            >
              <NavLink
                to={`/home/card-list/${deck.userId}/${deck.id}`}
                onClick={() => {
                  toggleModal();
                }}
              >
                <UnorderedListOutlined /> Card List
              </NavLink>
            </button>
          </li>
        ) : (
          ""
        )}
        <li>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsModalOpenList(false);
            }}
          >
            <FormOutlined /> Edit Deck
          </button>
        </li>
      </ul>
    </Modal>
  );

  function toggleModal() {
    setDeck(null);
    setIsModalOpenList((prevState) => !prevState);
  }
}

export function ModalListChangeCard({
  isModalOpenListChangeCard,
  setIsModalOpenListChangeCard,
  cardId,
  cards,
  setIsSomeCheckedCards,
  isSomeCheckedCards,
  setCards,
  listCardId,
  deck,
  nameDeck,
  userId,
  idDeck,
}) {
  const { firestore } = useContext(informationWithFirebase);
  const [isShowModalChangeCard, setIsShowModalChangeCard] = useState(false);
  const [isModalListDecks, setIsModalListDecks] = useState(false);
  return (
    <Modal
      footer={null}
      closable={null}
      className="modal"
      open={isModalOpenListChangeCard}
      onCancel={toggleModal}
    >
      <ul className="modal-list">
        <li>
          <button
            onClick={() => {
              isSomeCheckedCards
                ? setIsModalListDecks(true)
                : setIsShowModalChangeCard(true);
            }}
          >
            <FormOutlined /> {isSomeCheckedCards ? "Change Deck" : "Edit"}
          </button>
        </li>
        {isShowModalChangeCard && (
          <ModalChangeCard
            setIsShowModalChangeCard={setIsShowModalChangeCard}
            isShowModalChangeCard={isShowModalChangeCard}
            cards={cards.find((item) => item.idCard === cardId)}
            userId={userId}
            deck={deck}
            setIsModalOpenListChangeCard={setIsModalOpenListChangeCard}
            cardId={cardId}
          />
        )}
        {isModalListDecks && (
          <ModalListDeck
            deck={deck}
            userId={userId}
            listCardId={listCardId}
            nameDeck={nameDeck}
            idDeck={idDeck}
            isModalListDecks={isModalListDecks}
            setIsModalOpenListChangeCard={setIsModalOpenListChangeCard}
            setCards={setCards}
            setIsModalListDecks={setIsModalListDecks}
          />
        )}
        <li>
          <button onClick={showDeleteConfirm}>
            <DeleteOutlined />
            Delete {isSomeCheckedCards && "Cards"}
          </button>
        </li>
      </ul>
    </Modal>
  );
  function showDeleteConfirm() {
    confirm({
      title: "Do you want to delete following cards?",
      icon: <ExclamationCircleFilled />,
      content: (
        <ul>
          {!isSomeCheckedCards &&
            cards
              .filter((card) => card.idCard === cardId)
              .map((card) => <li>{card.wordCard}</li>)}
          {isSomeCheckedCards &&
            cards
              .filter((card) => listCardId.includes(card.idCard))
              .map((card) => <li>{card.wordCard}</li>)}
        </ul>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteCard();
      },
      onCancel() {
        toggleModal();
      },
    });
  }
  function deleteCard() {
    firestore
      .collection("decks")
      .where("id", "==", idDeck)
      .get()
      .then((data) => {
        data.docs.forEach((doc) => {
          const cards = doc.data().cards;
          const updatedCards = isSomeCheckedCards
            ? cards.filter((card) => !listCardId.includes(card.idCard))
            : cards.filter((card) => card.idCard !== cardId);

          doc.ref.update({ cards: updatedCards }).then((_) => {
            setCards(updatedCards);
          });
        });
      });

    toggleModal();
  }

  function toggleModal() {
    setIsSomeCheckedCards(false);
    setIsModalOpenListChangeCard((prevState) => !prevState);
  }
}
export function ModalListDeck({
  listCardId,
  deck,
  userId,
  setCards,
  setIsModalOpenListChangeCard,
  nameDeck,
  isModalListDecks,
  setIsModalListDecks,
}) {
  const { firestore, firebase } = useContext(informationWithFirebase);
  const [cardList, setCardList] = useState();
  useEffect(() => {
    const matchingCards = [];

    deck.forEach((item) => {
      if (item.userId === userId) {
        item.cards.forEach((itemCard) => {
          if (listCardId.includes(itemCard.idCard)) {
            matchingCards.push(itemCard);
          }
        });
      }
    });

    setCardList(matchingCards);
  }, [deck, listCardId, userId]);
  return (
    <Modal
      footer={null}
      closable={null}
      className="modal"
      open={isModalListDecks}
      onCancel={toggleModal}
    >
      <ul className="modal-list">
        {deck.map((doc) => {
          if (doc.userId === userId) {
            return (
              <li>
                <button onClick={(e) => changeDeckCards(e.target.innerText)}>
                  {doc.nameDeck}
                </button>
              </li>
            );
          }
        })}
      </ul>
    </Modal>
  );

  function changeDeckCards(deckName) {
    if (deckName === nameDeck) {
      setIsModalOpenListChangeCard(false);
      return;
    } else {
      firestore
        .collection("decks")
        .get()
        .then((data) => {
          data.docs.find((doc) => {
            if (doc.data().nameDeck === nameDeck) {
              const cards = doc.data().cards;
              const updatedCardsCurrentDeck = cards.filter(
                (card) => !listCardId.includes(card.idCard)
              );
              doc.ref.update({ cards: updatedCardsCurrentDeck });
              setCards(updatedCardsCurrentDeck);
            } else if (doc.data().nameDeck === deckName) {
              cardList.forEach((element) => {
                doc.ref.update({
                  cards: firebase.firestore.FieldValue.arrayUnion(element),
                });
              });
            }
          });
        });
    }
    toggleModal();
  }
  function toggleModal() {
    setIsModalOpenListChangeCard(false);
    setIsModalListDecks((prevState) => !prevState);
  }
}

export function ModalChangeCard({
  setIsShowModalChangeCard,
  cards,
  deck,
  cardId,
  setIsModalOpenListChangeCard,
  isShowModalChangeCard,
  isModalChangeCard,
  setIsModalChangeCard,
  userId,
}) {
  const { wordCard, definition, example } = cards || {};
  const { firestore, firebase } = useContext(informationWithFirebase);
  const [word, setWord] = useState(wordCard);
  const [definitionCard, setDefinitionCard] = useState(definition);
  const [exampleCard, setExampleCard] = useState(example);
  const [deckName, setDeckName] = useState("");
  const [listDeckNames, setListDeckNames] = useState([]);
  const [previousDeckName, setPreviousDeckName] = useState("");
  const [card, setCard] = useState(null);
  useEffect(() => {
    const filteredDeckNames = [];

    deck.forEach((item) => {
      if (item.userId === userId) {
        const options = [];

        item.cards.forEach((itemCard) => {
          if (itemCard.idCard === cardId) {
            setCard(itemCard);
            setDeckName(item.nameDeck);
          }
        });
        options.push({
          label: item.nameDeck,
          value: item.nameDeck,
        });

        if (options.length > 0) {
          filteredDeckNames.push({ options });
        }
      }
    });

    setListDeckNames(filteredDeckNames);
  }, [cardId, deck, userId]);

  return (
    <div>
      <Modal
        footer={null}
        className="modal"
        open={isShowModalChangeCard || isModalChangeCard}
        onCancel={toggleModal}
      >
        <Form
          layout={"vertical"}
          onFinish={onSubmit}
          autoComplete="off"
          initialValues={{
            WORD: word,
            DEFINITION: definitionCard,
            EXAMPLE: exampleCard,
          }}
        >
          <Select
            value={deckName}
            onChange={(e) => {
              handleDeckNameChange(e);
            }}
            style={{
              width: 200,
              marginBottom: 20,
            }}
            options={listDeckNames}
          />
          <Form.Item
            label="WORD"
            name="WORD"
            rules={[
              {
                required: true,
                message: "Please input memorize!",
              },
            ]}
          >
            <Input
              defaultValue={wordCard}
              placeholder="memorize"
              onChange={(e) => setWord(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="DEFINITION"
            name="DEFINITION"
            rules={[
              {
                required: true,
                message: "Please input definition!",
              },
            ]}
          >
            <Input
              placeholder="to learn by heart, commit to memory"
              onChange={(e) => setDefinitionCard(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="EXAMPLE (OPTIONAL)"
            name="EXAMPLE"
            tooltip={{
              icon: (
                <InfoCircleOutlined
                  onClick={() =>
                    info(
                      "Additional:",
                      <p>
                        Additional item will be shown at the last of the each
                        card. This is a good place to provide supplement
                        information. (e.g. example sentence of an English word)
                      </p>
                    )
                  }
                />
              ),
            }}
          >
            <Input
              placeholder="He memorized thousands of verses."
              onChange={(e) => setExampleCard(e.target.value)}
            />
          </Form.Item>
          <Button type="default" htmlType="submit">
            Change
          </Button>
        </Form>
      </Modal>
    </div>
  );

  function handleDeckNameChange(newDeckName) {
    setPreviousDeckName(deckName);
    setDeckName(newDeckName);
  }
  function onSubmit() {
    if (!previousDeckName) {
      firestore
        .collection("decks")
        .where("nameDeck", "==", deckName)
        .get()
        .then((data) => {
          data.docs.map((doc) => {
            const cards = doc.data().cards;
            const updatedCards = cards.map((item) => {
              if (item.idCard === cardId) {
                return {
                  ...item,
                  wordCard: word,
                  definition: definitionCard,
                  example: exampleCard,
                };
              }
              return item;
            });
            doc.ref.update({ cards: updatedCards });
          });
        });
    } else {
      firestore
        .collection("decks")
        .get()
        .then((data) => {
          data.docs.find((doc) => {
            if (doc.data().nameDeck === previousDeckName) {
              const cards = doc.data().cards;
              const updatedCardsCurrentDeck = cards.filter(
                (item) => item.idCard !== cardId
              );
              doc.ref.update({ cards: updatedCardsCurrentDeck });
            } else if (doc.data().nameDeck === deckName) {
              doc.ref.update({
                cards: firebase.firestore.FieldValue.arrayUnion(card),
              });
            }
          });
        });
    }
    toggleModal();
  }

  function toggleModal() {
    if (setIsShowModalChangeCard === undefined) {
      setIsModalChangeCard((prevState) => !prevState);
    } else {
      setIsShowModalChangeCard((prevState) => !prevState);
      setIsModalOpenListChangeCard(false);
    }
    setListDeckNames(null);
  }
}

export function ListManyCardsLearn({
  isModalListCardsLearn,
  cardsLearnForDecks,
  setIsModalListCardsLearn,
}) {
  const [countOfWordsLearn, setCountOfWordsLearn] = useState(20);
  const [isCustomWordsCountPopupEnabled, setIsCustomWordsCountPopupEnabled] =
    useState(false);
  const navigate = useNavigate();
  return (
    <>
      <Modal
        footer={null}
        closable={null}
        className="modal"
        title="How many cards to learn?"
        open={isModalListCardsLearn}
        onCancel={toggleModalListCardsLearn}
      >
        <ul className="modal-list">
          <li className="list-item">
            <button onClick={(e) => learnCardsMove(e.target.innerText)}>
              5
            </button>
          </li>
          <li className="list-item">
            <button onClick={(e) => learnCardsMove(e.target.innerText)}>
              10
            </button>
          </li>
          <li className="list-item">
            <button onClick={(e) => learnCardsMove(e.target.innerText)}>
              15
            </button>
          </li>
          <li className="list-item">
            <button onClick={(e) => learnCardsMove(e.target.innerText)}>
              All
            </button>
          </li>
          <li className="list-item">
            <button
              onClick={() => {
                setIsCustomWordsCountPopupEnabled(true);
              }}
            >
              Custom...
            </button>
          </li>
        </ul>
      </Modal>
      {isCustomWordsCountPopupEnabled && (
        <Modal
          footer={null}
          closable={null}
          className="modal"
          title="Input the amount of cards"
          open={isCustomWordsCountPopupEnabled}
          onCancel={toggleModalCustomWordsCountPopup}
        >
          <Input
            onChange={(e) => setCountOfWordsLearn(e.target.value)}
            value={countOfWordsLearn}
            className="count-learn-card"
          />
          <Button
            block
            disabled={!Number(countOfWordsLearn) || countOfWordsLearn < 0}
            onClick={() => {
              toggleModalListCardsLearn();
              learnCardsMove(countOfWordsLearn);
            }}
          >
            Start
          </Button>
        </Modal>
      )}
    </>
  );

  function learnCardsMove(amount) {
    let isExecuted = false;
    if (cardsLearnForDecks.length === 1) {
      cardsLearnForDecks.map((deck) => {
        return deck.cards.find((card) => {
          if (card.nextTest <= new Date() || card.nextTest === null) {
            navigate(
              `/home/learn/${deck.id}/${amount === "All" ? 1000 : amount}`
            );
            isExecuted = true;
            return true;
          }
        });
      });
    } else {
      cardsLearnForDecks.some((deck) => {
        const foundCard = deck.cards.find((card) => {
          if (card.nextTest <= new Date() || card.nextTest === null) {
            navigate(`/home/learn/all/${amount === "All" ? 1000 : amount}`);
            isExecuted = true;
            return true;
          }
        });
        return foundCard;
      });
    }

    if (!isExecuted) {
      confirm({
        title: "No cards to learn",
        icon: <ExclamationCircleFilled />,
        content: (
          <p>
            You have finished today's session. (You can still proceed by
            clicking "Learn anyway", but it will not affect the Memory Level)
          </p>
        ),
        okText: "Ok",
        okType: "danger",
        cancelText: "Learn anyway",
        onOk() {
          toggleModalListCardsLearn();
        },
        onCancel: () => {
          if (cardsLearnForDecks.length === 1) {
            cardsLearnForDecks.map((deck) => {
              navigate(
                `/home/practice/${deck.id}/${amount === "All" ? 1000 : amount}`
              );
            });
          } else {
            navigate(`/home/practice/all/${amount === "All" ? 1000 : amount}`);
          }
        },
      });
    }
  }
  function toggleModalListCardsLearn() {
    setIsModalListCardsLearn((prevState) => !prevState);
  }
  function toggleModalCustomWordsCountPopup() {
    toggleModalListCardsLearn();
    setIsCustomWordsCountPopupEnabled((prevState) => !prevState);
  }
}

function info(title, message) {
  Modal.info({
    title: title,
    content: <div>{message}</div>,
    onOk() {},
  });
}
