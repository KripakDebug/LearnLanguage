import React, { useContext, useState } from "react";
import { Form, Input, Modal, Select, Switch } from "antd";
import { Context } from "../../../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import uuid from "react-uuid";
function ModalTask({ isModalOpen, setIsModalOpen }) {
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
      onOk={toggleModal}
      onCancel={toggleModal}
    >
      <Form
        layout={"vertical"}
        initialValues={{
          remember: true,
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
          <div className="title">QUIZ TYPE</div>
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
        <button disabled={name === "" && true} type="submit">
          Create
        </button>
      </Form>
    </Modal>
  );

  function onSubmit(e) {
    firestore.collection("cards").add({
      id: uuid(),
      userId: user.uid,
      name,
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
