import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editProfileImage,
  getUser,
  updateOrganization,
} from "../../Pages/Sign/signSlice";
import { capitalize, filter, forEach, map, some } from "lodash";
import { checkOrganization } from "./constants";
import ImageCrop from "../ImageCrop/ImageCrop";
import Input from "../Inputs/Input";
import SaveButton from "../Buttons/SaveButton";
import CheckboxList from "../CheckboxList/CheckboxList";
import SelectRegion from "../Select/SelectRegion";
import SelectCategory from "../Select/SelectCategory";

const EditOrganization = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.login);
  const { regions } = useSelector((state) => state.regions);
  const { tradetypes } = useSelector((state) => state.trade);
  const { categoriesWithSubcategories } = useSelector(
    (state) => state.categories
  );

  const [modalIsOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const handleChangeImage = (croppedImage) => {
    const formData = new FormData();
    formData.append("file", croppedImage);
    dispatch(editProfileImage(formData)).then(({ error, payload }) => {
      if (!error) {
        setIsOpen(false);
        setImage(payload);
      }
    });
  };

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [email, setEmail] = useState("");
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tradeTypes, setTradeTypes] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    name === "name" && setName(capitalize(value));
    name === "phone" && setPhone(value);
    name === "email" && setEmail(value);
  };

  const selectRegion = (e) => {
    setRegion(e);
    setDistricts(e.districts);
  };

  const selectDistrict = (e) => {
    setDistrict(e);
  };

  const changeTradeTypes = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const filtered = filter(tradeTypes, (tradeType) => tradeType !== value);
    checked
      ? setTradeTypes([...filtered, value])
      : setTradeTypes([...filtered]);
  };

  const filterSubcategory = (categories) => {
    const filterSubcategory = filter(subcategories, (subcategory) =>
      some(categories, ["value", subcategory.category])
    );
    setSubcategories(filterSubcategory);
  };

  const filterAllSubcategories = (e) => {
    let subCategories = [];
    forEach(e, (category) => subCategories.push(...category.subcategories));
    setAllSubcategories(subCategories);
  };
  const selectCategory = (e) => {
    setCategories(e);
    filterAllSubcategories(e);
    filterSubcategory(e);
  };

  const selectSubcategory = (e) => {
    filterAllSubcategories(categories);
    setSubcategories(e);
  };

  const enterHandler = (e) => {
    e.preventDefault();
    e.key === "Enter" && submitHandler();
  };

  const submitHandler = () => {
    const Categories = map(categories, (category) => category.value);
    const subCategories = map(
      subcategories,
      (subcategory) => subcategory.value
    );
    const data = {
      name,
      phone,
      region: region.value,
      district: district.value,
      categories: Categories,
      subcategories: subCategories,
      tradetypes: tradeTypes,
      email,
    };
    const check = checkOrganization({
      ...data,
    });
    if (image !== null) {
      data.image = image;
    }
    check && createHandler(data);
  };

  const createHandler = (data) => {
    dispatch(updateOrganization(data)).then(({ error, payload }) => {
      if (!error) {
        const { organization } = payload;
        setAllDatas(organization);
      }
    });
  };

  const setAllDatas = (organization) => {
    organization.name && setName(organization.name);
    organization.phone && setPhone(organization.phone);
    organization.email && setEmail(organization.email);
    organization.region && setRegion(organization.region);
    organization.district && setDistrict(organization.district);
    organization.image && setImage(organization.image);
    organization.categories && setCategories(organization.categories);
    if (organization.categories && organization.categories.length > 0) {
      const data = [];
      forEach(organization.categories, (category) =>
        forEach(category.subcategories, (subcategory) => data.push(subcategory))
      );
      setAllSubcategories(data);
    }
    organization.subcategories && setSubcategories(organization.subcategories);
    organization.tradetypes && setTradeTypes(organization.tradetypes);
  };
  useEffect(() => {
    dispatch(getUser()).then(({ error, payload }) => {
      if (!error) {
        const { organization } = payload;
        organization && setAllDatas(organization);
      }
    });
  }, [dispatch]);

  return (
    <div className="p-5 flex ">
      <div className="w-1/3">
        <ImageCrop
          modalIsOpen={modalIsOpen}
          setIsOpen={setIsOpen}
          approve={handleChangeImage}
          output={image}
        />
      </div>
      <div className="w-full">
        <div className="grid grid-cols-3 gap-4">
          <Input
            placeholder="Tashkilot nomi"
            label="Tashkilot nomi"
            name="name"
            value={name}
            onChange={changeHandler}
            onKeyUp={enterHandler}
          />
          <Input
            placeholder="Telefon raqami"
            label="Telefon raqami"
            name="phone"
            value={phone}
            onChange={changeHandler}
            onKeyUp={enterHandler}
          />
          <Input
            placeholder="email"
            label="Email"
            name="email"
            value={email}
            onChange={changeHandler}
            onKeyUp={enterHandler}
          />
        </div>
        <SelectRegion
          region={region}
          regions={regions}
          selectRegion={selectRegion}
          districts={districts}
          district={district}
          selectDistrict={selectDistrict}
          loading={loading}
          labelRegion={"Viloyat"}
          labelDistrict={"Tuman"}
        />
        <div className="mb-2 w-full">
          <CheckboxList
            list={tradetypes}
            onChange={changeTradeTypes}
            headerText="Savdo turingizni tanlang"
            checkedList={tradeTypes}
            headerStyle="text-sm text-[#777] font-normal"
            cols={2}
          />
        </div>
        <SelectCategory
          categories={categories}
          selectSubcategory={selectSubcategory}
          subcategories={subcategories}
          selectCategory={selectCategory}
          loading={loading}
          allSubcategories={allSubcategories}
          categoriesWithSubcategories={categoriesWithSubcategories}
        />
        <SaveButton
          isDisabled={loading}
          title="Saqlash"
          onClick={submitHandler}
          className="mt-3 w-full"
        />
      </div>
    </div>
  );
};

export default EditOrganization;