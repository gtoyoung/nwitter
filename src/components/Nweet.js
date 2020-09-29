import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-awesome-modal";
import moment from "moment";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [visible, setVisible] = useState(false);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");

    if (ok) {
      await dbService
        .doc(`nweets/${nweetObj.id}`)
        .delete()
        .then(() => {
          if (nweetObj.attachmentUrl !== "") {
            storageService
              .refFromURL(`${nweetObj.attachmentUrl}`)
              .delete()
              .catch(() => {
                window.confirm("Delete fail!");
              });
          } else {
          }
        });
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    const data = {
      text: newNweet,
    };
    await dbService.doc(`nweets/${nweetObj.id}`).update(data);
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  const openModal = () => {
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };
  return (
    <div
      className="nweet"
      style={{
        backgroundImage: "url(" + nweetObj.attachmentUrl + ")",
      }}
    >
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <div className="nweet_content">{nweetObj.text}</div>
          {isOwner ? (
            <div className="nweet__myInfo">
              <span>
                {nweetObj.displayName}
                <br />
                {moment(nweetObj.createdAt).format("YYYY-MM-DD hh:mm:ss")}
              </span>
              {nweetObj.attachmentUrl && (
                <img src={nweetObj.attachmentUrl} onClick={openModal} />
              )}
            </div>
          ) : (
            <div className="nweet__otherInfo">
              <span>
                {nweetObj.displayName}
                <br />
                {moment(nweetObj.createdAt).format("YYYY-MM-DD hh:mm:ss")}
              </span>
              {nweetObj.attachmentUrl && (
                <img src={nweetObj.attachmentUrl} onClick={openModal} />
              )}
            </div>
          )}
          {isOwner && (
            <div class="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
          <Modal
            visible={visible}
            width="400"
            height="300"
            effect="fadeInLeft"
            onClickAway={closeModal}
          >
            <div
              style={{
                backgroundImage: "url(" + nweetObj.attachmentUrl + ")",
                width: "400px",
                height: "300px",
              }}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default Nweet;
