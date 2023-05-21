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
              onClick={() => infoModal("Quiz Type:", <p>fdfd</p>)}
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
              For language learning?
              <Switch onChange={(e) => setLanguageLearning(e)} />
              {languageLearning && (
                <Select
                  defaultValue="English"
                  style={{
                    width: 200,
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
            </li>
            <li>
              Random Order
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
      cards: 0,
      flashcard,
      flashcardReverse,
      typing,
      languageLearning,
      randomOrder,
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
