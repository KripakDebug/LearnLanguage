import React, { useContext } from "react";
import { Form, Input, Modal } from "antd";
import { Context } from "../../../../index";
import { InfoCircleOutlined } from "@ant-design/icons";

export default function ModalCreateCard({
  isModalCreateCardOpen,
  setIsModalCreateCardOpen,
  infoModal,
  cardName,
}) {
  const { firestore } = useContext(Context);
  return (
    <div>
      <Modal
        title="Add Card to"
        footer={null}
        className="modal"
        open={isModalCreateCardOpen}
        onOk={toggleModal}
        onCancel={toggleModal}
      >
        <p>{cardName}</p>
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
            <Input placeholder="memorize" />
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
            <Input placeholder="to learn by heart, commit to memory" />
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
            rules={[
              {
                required: true,
                message: "Please input example!",
              },
            ]}
          >
            <Input placeholder="He memorized thousands of verses." />
          </Form.Item>
          <button type="submit">Add</button>
        </Form>
      </Modal>
    </div>
  );
  function onSubmit() {}

  function toggleModal() {
    setIsModalCreateCardOpen((prevState) => !prevState);
  }
}
