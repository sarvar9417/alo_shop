import React from "react";
import { IoPencilSharp, IoTrashOutline } from "react-icons/io5";

const CardEdit = ({ editHandler, orderId, deleteHandler }) => {
  return (
    <div className="w-full border-t grid grid-cols-2 m-0">
      <button
        onClick={() => editHandler(orderId)}
        className="w-full flex justify-center border-r py-1 "
      >
        <IoPencilSharp size={25} className="text-neutral-500" />
      </button>
      <button
        className=" w-full flex justify-center py-1"
        onClick={() => deleteHandler(orderId)}
      >
        <IoTrashOutline size={25} className="text-neutral-500" />
      </button>
    </div>
  );
};

export default CardEdit;
