import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, getOrders, getOrdersCount } from "../Orders/orderSlice";
import { map, uniqueId } from "lodash";
import OrderCard from "../../../Components/OrderCard/OrderCard";
import UniversalModal from "../../../Components/Modal/UniversalModal";
import MainPageHeader from "../../../Components/MainPageHeader/MainPageHeader";
import Pagination from "../../../Components/Pagination/Pagination";
import { useTranslation } from "react-i18next";
import { getTranslations } from "../../../translation";

const Main = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common"]);
  const translations = getTranslations(t);
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
  const { logged, userData } = useSelector((state) => state.login);
  const [orderId, setOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);
  const countPage = 10;
  const { user } = userData;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalBody, setModalBody] = useState(null);

  const closeHandler = () => {
    setModalVisible(false);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
      count: 4,
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
    dispatch(getOrdersCount(data)).then(
      ({ error, payload: { totalCount } }) => {
        if (!error) {
          setTotalDatas(totalCount);
        }
      }
    );
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
    dispatch(getOrders(data));
    dispatch(getOrdersCount(data)).then(
      ({ error, payload: { totalCount } }) => {
        if (!error) {
          setTotalDatas(totalCount);
        }
      }
    );
    //    eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, order, currentPage, countPage]);

  return (
    <div className="h-full w-full bg-neutral-100 flex flex-col">
      {logged ? (
        <div className="bg-white-900 py-3 shadow-md flex justify-between items-center px-4">
          <h3 className="font-amazonbold">
            {translations.jami_buyurtmalar}: {totalDatas} {translations.ta}
          </h3>
          {totalDatas > 0 && (
            <Pagination
              currentPage={currentPage}
              countPage={countPage}
              setCurrentPage={setCurrentPage}
              totalDatas={totalDatas}
            />
          )}
        </div>
      ) : (
        <MainPageHeader
          translations={translations}
          countPage={countPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalDatas={totalDatas}
        />
      )}
      <div className="p-4 pt-0 overflow-scroll h-full w-full">
        {map(orders, (order) => (
          <OrderCard
            translations={translations}
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
        headerText={translations.buyurtmani_ochirish}
        title={translations.siz_buyurtmani_ochirishni_xohlaysizmi}
        approveFunction={deleteOrderById}
      />
    </div>
  );
};

export default Main;
