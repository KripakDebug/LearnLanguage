import React, { useState } from "react";
import { Form, Input, Modal, Select, Switch } from "antd";

function ModalTask({ isModalOpen, setIsModalOpen }) {
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
              <Switch defaultChecked onChange={(e) => setFlashcard(e)} />
            </li>
            <li>
              Flashcard Reverse
              <Switch defaultChecked onChange={(e) => setFlashcardReverse(e)} />
            </li>
            <li>
              Typing <Switch defaultChecked onChange={(e) => setTyping(e)} />
            </li>
          </ul>
        </Form.Item>
        <Form.Item>
          <div className="title">ADDITIONAL</div>
          <ul className="list">
            <li>
              For language learning?
              <Switch defaultChecked onChange={(e) => setLanguageLearning(e)} />
              <Select
                defaultValue="English"
                style={{
                  width: 200,
                }}
                options={[
                  {
                    label: "",
                    options: [
                      {
                        label: "Jack",
                        value: "jack",
                      },
                      {
                        label: "Lucy",
                        value: "lucy",
                      },
                    ],
                  },
                ]}
              />
            </li>
            <li>
              Random Order
              <Switch defaultChecked onChange={(e) => setRandomOrder(e)} />
            </li>
          </ul>
        </Form.Item>
      </Form>
    </Modal>
  );

  function onSubmit(e) {}
  function toggleModal() {
    setIsModalOpen((prevState) => !prevState);
  }
}

export default ModalTask;
