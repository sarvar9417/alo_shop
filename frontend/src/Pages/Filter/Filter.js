import React from "react";
import CheckboxList from "../../Components/CheckboxList/CheckboxList";
import SelectCheckbox from "../../Components/SelectCheckbox/SelectCheckbox";
import { useDispatch, useSelector } from "react-redux";
import { filter } from "lodash";
import {
  filterCategories,
  filterDistricts,
  filterName,
  filterRegions,
  filterSubcategories,
  filterTradeTypes,
} from "./filterSlice";
import { IoSearchOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { getTranslations } from "../../translation";

const Filter = ({ categories, regions, tradeTypes }) => {
  const { t } = useTranslation(["common"]);
  const { Filter, savdo_turi, davlatlar, kategoriyalar, nomi_bilan_qidirish } =
    getTranslations(t);
  const dispatch = useDispatch();
  const [name, setName] = React.useState("");
  const {
    tradetypes,
    categories: categoriesList,
    subcategories,
    districts,
    regions: regionsList,
  } = useSelector((state) => state.filter);

  const changeName = (e) => {
    const value = e.target.value;
    setName(value);
  };

  const enterHandler = (e) => {
    if (e.key === "Enter") {
      dispatch(filterName(name));
    }
  };

  const handleSearch = () => {
    dispatch(filterName(name));
  };

  const changeTradeTypes = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const filtered = filter(tradetypes, (tradetype) => tradetype !== value);
    dispatch(
      checked
        ? filterTradeTypes([...filtered, value])
        : filterTradeTypes([...filtered])
    );
  };

  const changeCategories = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const filtered = filter(categoriesList, (category) => category !== value);
    const newCategories = checked ? [...filtered, value] : [...filtered];
    dispatch(filterCategories(newCategories));
  };

  const changeSubcategories = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const filtered = filter(
      subcategories,
      (subcategory) => subcategory !== value
    );
    const newSubcategories = checked ? [...filtered, value] : [...filtered];
    dispatch(filterSubcategories(newSubcategories));
  };

  const changeRegions = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const filtered = filter(regionsList, (region) => region !== value);
    const newRegions = checked ? [...filtered, value] : [...filtered];
    dispatch(filterRegions(newRegions));
  };

  const changeDistricts = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const filtered = filter(districts, (district) => district !== value);
    const newDistricts = checked ? [...filtered, value] : [...filtered];
    dispatch(filterDistricts(newDistricts));
  };

  return (
    <div className="w-1/3 min-w-[300px] max-w-[400px] overflow-scroll shadow">
      <div className="p-4">
        <h1 className="font-amazonbold text-xl tracking-widest text-secondary-medium">
          {Filter}
        </h1>
        <div className="flex w-full pl-3 mt-2">
          <input
            onKeyUp={enterHandler}
            onChange={changeName}
            type="text"
            className="w-full border  rounded-l px-3 text-sm py-1 outline-0"
            placeholder={nomi_bilan_qidirish}
          />
          <button
            onClick={handleSearch}
            className="w-1/5 rounded-r bg-primary-800 text-white-900 border border-l-0 flex justify-center items-center"
          >
            <IoSearchOutline />
          </button>
        </div>
        <CheckboxList
          checkedList={tradetypes}
          list={tradeTypes}
          headerText={savdo_turi}
          headerStyle="ml-3 mt-3"
          listStyle="pl-3"
          onChange={changeTradeTypes}
        />
        <SelectCheckbox
          headerCheckeds={categoriesList}
          changeHeader={changeCategories}
          changeBody={changeSubcategories}
          bodyCheckeds={subcategories}
          headerText={kategoriyalar}
          datas={categories}
          property="subcategories"
        />
        <SelectCheckbox
          headerCheckeds={regionsList}
          bodyCheckeds={districts}
          changeHeader={changeRegions}
          changeBody={changeDistricts}
          headerText={davlatlar}
          datas={regions}
          property="districts"
        />
      </div>
    </div>
  );
};

export default Filter;
