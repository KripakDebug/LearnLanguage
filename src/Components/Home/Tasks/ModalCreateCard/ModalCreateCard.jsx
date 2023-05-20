import React, { useContext, useState } from "react";
import { Form, Input, Modal } from "antd";
import { Context } from "../../../../index";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ModalCreateCard({ id, idDeck }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  return (
    <div>
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
            <Input placeholder="Name the new deck" />
          </Form.Item>
          <Form.Item>
            <div className="title">QUIZ TYPE</div>
            <ul className="list">
              <li>Flashcard</li>
              <li>Flashcard Reverse</li>
              <li>Typing</li>
            </ul>
          </Form.Item>
          <Form.Item>
            <div className="title">ADDITIONAL</div>
            <ul className="list">
              <li>For language learning?</li>
              <li>Random Order</li>
            </ul>
          </Form.Item>
          <button type="submit">Create</button>
        </Form>
      </Modal>
    </div>
  );
  function onSubmit() {}

  function toggleModal() {
    setIsModalOpen((prevState) => !prevState);
  }
}
