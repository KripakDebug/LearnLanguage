import React, { useContext, useState } from "react";
import { Button, Form, Input, Modal, Select, Switch } from "antd";
import { Context } from "../../../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import uuid from "react-uuid";
import { InfoCircleOutlined } from "@ant-design/icons";
function ModalTask({ isModalOpen, setIsModalOpen, infoModal }) {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [flashcard, setFlashcard] = useState(false);
  const [flashcardReverse, setFlashcardReverse] = useState(false);
  const [typing, setTyping] = useState(false);
  const [languageLearning, setLanguageLearning] = useState(false);
  const [randomOrder, setRandomOrder] = useState(false);
  const [language, setLanguage] = useState("English");

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
            placeholder="Name the new deck"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <div className="title">
            QUIZ TYPE
            <InfoCircleOutlined
              onClick={() =>
                infoModal(
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
              <Switch onChange={(e) => setFlashcard(e)} />
            </li>
            <li>
              Flashcard Reverse
              <Switch onChange={(e) => setFlashcardReverse(e)} />
            </li>
            <li>
              Typing <Switch onChange={(e) => setTyping(e)} />
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
                    infoModal(
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
              <Switch onChange={(e) => setLanguageLearning(e)} />
            </li>
            {languageLearning && (
              <Select
                defaultValue="English"
                value={language}
                onChange={(e) => {
                  setLanguage(e);
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
                    infoModal(
                      "Random Order:",
                      <p>
                        When you start a learning session, the cards will be
                        shuffled and displayed in a random order.
                      </p>
                    )
                  }
                />
              </div>
              <Switch onChange={(e) => setRandomOrder(e)} />
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
      name,
      cards: [],
      flashcard,
      flashcardReverse,
      typing,
      languageLearning,
      randomOrder,
      language,
    });
    setName("");
    setFlashcard(false);
    setFlashcardReverse(false);
    setTyping(false);
    setLanguageLearning(false);
    setRandomOrder(false);
    toggleModal();
  }
  function toggleModal() {
    setIsModalOpen((prevState) => !prevState);
  }
}

export default ModalTask;
