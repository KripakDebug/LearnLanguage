import React, { useContext, useEffect, useState } from "react";
import { informationWithFirebase } from "../index";
import { Button, Form, Input, Modal, Select, Switch } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  FormOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import uuid from "react-uuid";
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink } from "react-router-dom";
const { confirm } = Modal;

export function ModalCreateCard({
  isModalCreateCardOpen,
  setIsModalCreateCardOpen,
  deck,
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
            learn: 1,
            active: false,
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
    setIsModalCreateCardOpen((prevState) => !prevState);
  }
}

export function ModalTask({ isModalOpen, setIsModalOpen, deck, setDeck }) {
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
  const [isFlashcard, setIsFlashcard] = useState(flashcardDeck || true);
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
}) {
  const { cards } = deck;
  return (
    <Modal
      footer={null}
      closable={null}
      className="modal"
      open={isModalOpenList}
      onCancel={toggleModal}
    >
      <ul className="modal-list">
        <li>
          <button
            onClick={() => {
              toggleModal();
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
                to={`/home/card-list/${deck.id}`}
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
              toggleModal();
            }}
          >
            <FormOutlined /> Edit Deck
          </button>
        </li>
      </ul>
    </Modal>
  );

  function toggleModal() {
    setIsModalOpenList((prevState) => !prevState);
  }
}

export function ModalListChangeCard({
  isModalOpenListChangeCard,
  setIsModalOpenListChangeCard,
  cardId,
  cards,
  menuShowForRadio,
  setMenuShowForRadio,
  setCards,
  deck,
}) {
  const { auth, firestore } = useContext(informationWithFirebase);
  const [isShowModalChangeCard, setIsShowModalChangeCard] = useState(false);
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
          <button onClick={() => setIsShowModalChangeCard(true)}>
            <FormOutlined /> {menuShowForRadio ? "Change Deck" : "Edit"}
          </button>
        </li>
        {isShowModalChangeCard && (
          <ModalChangeCard
            setIsShowModalChangeCard={setIsShowModalChangeCard}
            isShowModalChangeCard={isShowModalChangeCard}
            cards={cards.cards.find((item) => item.idCard === cardId)}
            deck={deck}
            setIsModalOpenListChangeCard={setIsModalOpenListChangeCard}
            cardId={cardId}
          />
        )}
        <li>
          <button onClick={showDeleteConfirm}>
            <DeleteOutlined />
            Delete {menuShowForRadio && "Cards"}
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
          {cards.cards.map((item) => {
            if (item.idCard === cardId) {
              return <li>{item.wordCard}</li>;
            }
            if (menuShowForRadio) {
              if (item.active) {
                return <li>{item.wordCard}</li>;
              }
            }
          })}
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
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          const cards = doc.data().cards;
          const updatedCards = cards.filter((item) => {
            if (menuShowForRadio) {
              return item.active !== true;
            }
            return item.idCard !== cardId;
          });
          doc.ref.update({ cards: updatedCards });
          setCards(doc.data());
        });
      });

    toggleModal();
  }
  function toggleModal() {
    setMenuShowForRadio(false);
    setIsModalOpenListChangeCard((prevState) => !prevState);
  }
}

export function ModalChangeCard({
  setIsShowModalChangeCard,
  cards,
  deck,
  cardId,
  setIsModalOpenListChangeCard,
  isShowModalChangeCard,
}) {
  const { wordCard, definition, example } = cards || {};
  const { firestore, firebase } = useContext(informationWithFirebase);
  const [word, setWord] = useState(wordCard);
  const [definitionCard, setDefinitionCard] = useState(definition);
  const [exampleCard, setExampleCard] = useState(example);
  const [deckName, setDeckName] = useState("");
  const [listDeckNames, setListDeckNames] = useState([]);
  const [previousDeckName, setPreviousDeckName] = useState("");

  useEffect(() => {
    const filteredDeckNames = [];

    deck.forEach((item) => {
      const options = [];

      item.cards.forEach((itemCard) => {
        if (itemCard.idCard === cardId) {
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
    });

    setListDeckNames(filteredDeckNames);
  }, [cardId, deck]);

  return (
    <div>
      <Modal
        footer={null}
        className="modal"
        open={isShowModalChangeCard}
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
            defaultValue="English"
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
    firestore
      .collection("decks")
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          if (doc.data().nameDeck === deckName) {
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
          } else {
            const cards = doc.data().cards;
            const updatedCardsСurrentDeck = cards.filter(
              (item) => item.idCard !== cardId
            );
            doc.ref.update({ cards: updatedCardsСurrentDeck });
            deck.map((dec) => {
              if (dec.nameDeck === deckName) {
                const updatedCards = cards.map((item) => {
                  return {
                    ...item,
                    wordCard: word,
                    definition: definitionCard,
                    example: exampleCard,
                  };
                });

                doc.ref.update({ cards: updatedCards });
              }
            });
          }
        });
      });
    toggleModal();
  }

  function toggleModal() {
    setIsShowModalChangeCard((prevState) => !prevState);
    setIsModalOpenListChangeCard(false);
    setListDeckNames(null);
  }
}

function info(title, message) {
  Modal.info({
    title: title,
    content: <div>{message}</div>,
    onOk() {},
  });
}
