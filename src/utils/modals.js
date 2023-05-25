import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Button, Form, Input, Modal, Select, Switch } from "antd";
import {
  FormOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import uuid from "react-uuid";
import { useAuthState } from "react-firebase-hooks/auth";

export function ModalCreateCard({
  isModalCreateCardOpen,
  setIsModalCreateCardOpen,
  idDeck,
  cardName,
}) {
  const { firestore, firebase } = useContext(Context);
  const [wordCard, setWordCard] = useState([]);
  const [definition, setDefinition] = useState([]);
  const [example, setExample] = useState([]);
  return (
    <div>
      <Modal
        footer={null}
        className="modal"
        open={isModalCreateCardOpen}
        onCancel={toggleModal}
      >
        <h2>Add card to {cardName}</h2>
        <Form
          layout={"vertical"}
          initialValues={{
            remember: true,
          }}
          onFinish={onSubmit}
          autoComplete="off"
        >
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
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          if (idDeck === doc.data().id) {
            const docRef = firestore.collection("decks").doc(doc.id);
            const cardsArray = doc.data().cards || [];
            function getWordArray(str) {
              const words = str.split(" ");
              const wordArray = words.map((word) =>
                word.trim().replace(/,$/, "")
              );
              return wordArray;
            }

            const wordCardArray = getWordArray(wordCard);
            const definitionWordArray = getWordArray(definition);

            const newCard = {
              idCard: uuid(),
              wordCard: wordCardArray,
              definition: definitionWordArray,
              example: example === [] ? null : example,
              createAt: firebase.firestore.Timestamp.fromDate(new Date()),
              learn: 1,
            };

            cardsArray.push(newCard);

            docRef.update({
              cards: cardsArray,
            });
          }
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
    languageDeck,
  } = deck || {};
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [name, setName] = useState(nameDeck || "");
  const [isFlashcard, setIsFlashcard] = useState(!!flashcardDeck);
  const [isFlashcardReverse, setIsFlashcardReverse] = useState(
    !!flashcardReverseDeck
  );
  const [isTyping, setIsTyping] = useState(!!typingDeck);
  const [isLanguageLearning, setIsLanguageLearning] = useState(
    !!languageLearningDeck
  );
  const [isRandomOrder, setIsRandomOrder] = useState(!!randomOrderDeck);
  const [isLanguage, setIsLanguage] = useState(languageDeck || "English");

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
          remember: false,
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
                onChange={(e) => setIsFlashcard(e)}
              />
            </li>
            <li>
              Flashcard Reverse
              <Switch
                checked={isFlashcardReverse}
                onChange={(e) => setIsFlashcardReverse(e)}
              />
            </li>
            <li>
              Typing{" "}
              <Switch checked={isTyping} onChange={(e) => setIsTyping(e)} />
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
        <Button disabled={name === "" && true} type="default" htmlType="submit">
          Create
        </Button>
      </Form>
    </Modal>
  );

  function onSubmit() {
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
    });
    setName("");
    setIsFlashcard(false);
    setIsFlashcardReverse(false);
    setIsTyping(false);
    setIsLanguageLearning(false);
    setIsRandomOrder(false);
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
}) {
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
        <li>
          <button
            onClick={() => {
              toggleModal();
            }}
          >
            <UnorderedListOutlined /> Card List
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              toggleModal();
              setIsModalOpen(true);
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

function info(title, message) {
  Modal.info({
    title: title,
    content: <div>{message}</div>,
    onOk() {},
  });
}
