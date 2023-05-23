import React, { useContext, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { Context } from "../../../../index";
import { InfoCircleOutlined } from "@ant-design/icons";
import uuid from "react-uuid";

export default function ModalCreateCard({
  isModalCreateCardOpen,
  setIsModalCreateCardOpen,
  idDeck,
  infoModal,
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
                    infoModal(
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
              learn: 0,
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
