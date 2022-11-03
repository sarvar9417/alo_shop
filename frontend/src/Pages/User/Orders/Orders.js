import React, { useEffect, useState } from "react";
import UniversalModal from "../../../Components/Modal/UniversalModal";
import PageHeader from "../../../Components/PageHeaders/PageHeader";
import OrderCard from "../../../Components/OrderCard/OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, getOrdersByFilter, deleteOrder } from "./orderSlice";
import { map, uniqueId } from "lodash";
import { filterOrder } from "../../Filter/filterSlice";
import MainPageHeader from "../../../Components/MainPageHeader/MainPageHeader";
import { onScroll } from "../globalConstants";
import { filter } from "./constants";

const Orders = () => {
  const dispatch = useDispatch();
  const {
    logged,
    userData: { user },
  } = useSelector((state) => state.login);
  const { orders } = useSelector((state) => state.orders);
  const {
    order,
    categories,
    subcategories,
    tradetypes,
    regions,
    districts,
    name,
  } = useSelector((state) => state.filter);
  const [orderId, setOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const countPage = 10;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalBody, setModalBody] = useState(null);

  const closeHandler = () => {
    setModalVisible(false);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const openModal = (body) => {
    setModalBody(body);
    setModalVisible(true);
    setOrderId(null);
  };

  const handleScroll = (e) => {
    onScroll({ e, currentPage, setCurrentPage, countPage, datas: orders });
  };

  const deleteHandler = (id) => {
    setOrderId(id);
    setModalBody("approve");
    setModalVisible(true);
  };

  const editHandler = (id) => {
    setOrderId(id);
    setModalBody("createOrder");
    setModalVisible(true);
  };

  const count = 2000;

  const handleFilter = (e) => {
    const value = e.target.value;
    dispatch(filterOrder(value));
  };

  const deleteOrderById = () => {
    orderId &&
      dispatch(deleteOrder({ id: orderId })).then(({ error }) => {
        if (!error) {
          setModalVisible(false);
          setOrderId(null);
        }
      });
  };

  useEffect(() => {
    const data = {
      page: 0,
      count: 10,
      order,
      categories,
      subcategories,
      tradetypes,
      regions,
      districts,
      user: user?._id,
      name,
    };
    setCurrentPage(0);
    dispatch(getOrders(data));
  }, [
    dispatch,
    order,
    categories,
    subcategories,
    tradetypes,
    regions,
    districts,
    user,
    name,
  ]);
  useEffect(() => {
    const data = {
      page: currentPage,
      count: countPage,
      order,
      categories,
      subcategories,
      tradetypes,
      regions,
      districts,
      user: user?._id,
      name,
    };

    currentPage !== 0 && dispatch(getOrdersByFilter(data));
    //    eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, order, currentPage, countPage]);
  return (
    <div
      className="h-screen w-full pb-20 bg-neutral-100 overflow-scroll "
      onScroll={handleScroll}
    >
      {logged ? (
        <PageHeader
          count={count}
          onClick={() => openModal("createOrder")}
          countTitle="Jami:"
          buttonTitle="Buyurtma yaratish"
          handleFilter={handleFilter}
          filterData={order}
          filter={filter}
        />
      ) : (
        <MainPageHeader />
      )}

      <div className="p-4 pt-0">
        {map(orders, (order) => (
          <OrderCard
            logged={logged}
            key={uniqueId()}
            order={order}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
          />
        ))}
      </div>
      <UniversalModal
        isOpen={modalVisible}
        body={modalBody}
        closeModal={closeHandler}
        toggleModal={toggleModal}
        orderId={orderId}
        modalBody={modalBody}
        headerText="Buyurtmani o'chirish"
        title="Siz rostdan ham buyurtmani o'chirmoqchimisiz?"
        approveFunction={deleteOrderById}
      />
    </div>
  );
};

export default Orders;
