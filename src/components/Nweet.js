import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
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
              .then(() => {
                window.confirm("Delete success!");
              });
          } else {
            window.confirm("Delete success!");
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
  return (
    <div>
      {editing ? (
        <>
          <form>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              onChange={onChange}
              required
            />
            <button onClick={onSubmit}>Update Nweet</button>
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img
              src={nweetObj.attachmentUrl}
              width="50px"
              height="50px"
              alt=""
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Button</button>
              <button onClick={toggleEditing}>Edit Button</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
