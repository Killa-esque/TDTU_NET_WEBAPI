import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import qs from "query-string";
import useSearchModal from "@/hooks/useSearchModal";

import CountrySelect from "@/components/User/Common/CountrySelect";
import Modal from "./Modal";
import Heading from "../Common/Heading";
import Calendar from "../Common/Calendar";
import Counter from "../Common/Counter";
import Amenities from "../Common/Amenities";
import ROUTES from "@/constants/routes";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
  AMENITIES = 3, // Thêm bước Amenities
}

function SearchModal() {
  const [params] = useSearchParams();
  const searchModel = useSearchModal();


  const [locationId, setLocationId] = useState<string>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
  const [disabledDates, setDisabledDates] = useState<Dayjs[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]); // Lưu tiện nghi
  const [minPrice, setMinPrice] = useState<number>(1);
  const [maxPrice, setMaxPrice] = useState<number>(500);

  const navigate = useNavigate();

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.AMENITIES) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationId,
      guestCount,
      roomCount,
      bathroomCount,
      minPrice,
      maxPrice,
      amenities: amenities.join(","),
    };

    if (dateRange[0]) {
      updatedQuery.startDate = dateRange[0].toISOString();
    }

    if (dateRange[1]) {
      updatedQuery.endDate = dateRange[1].toISOString();
    }

    const url = qs.stringifyUrl(
      {
        url: ROUTES.SEARCH,
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModel.onClose();

    navigate(url);
  }, [
    step,
    searchModel,
    location,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    minPrice,
    maxPrice,
    amenities,
    onNext,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.AMENITIES) {
      return "Search";
    }

    return "Next";
  }, [step]);

  const secondActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="Where do you wanna go?" subtitle="Find the perfect location!" />
      <CountrySelect
        locationId={locationId || ""}
        onChange={(value: string) => setLocationId(value)}
      />
      <hr />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="When do you plan to go?" subtitle="Make sure everyone is free!" />
        <Calendar
          value={dateRange}
          onChange={(dates) => setDateRange([dates[0] || dayjs(), dates[1] || dayjs()])}
          disabledDates={disabledDates}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="More information" subtitle="Find your perfect place!" />
        <Counter
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="Guests"
          subtitle="How many guests are coming?"
        />
        <hr />
        <Counter
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title="Rooms"
          subtitle="How many rooms do you need?"
        />
        <hr />
        <Counter
          onChange={(value) => setBathroomCount(value)}
          value={bathroomCount}
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
        />
      </div>
    );
  }

  if (step === STEPS.AMENITIES) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Filters" subtitle="Refine your search" />
        {/* Amenities */}
        <Amenities
          selectedAmenities={amenities} // Truyền vào mảng `id` đã chọn
          onChange={(updatedAmenities) => setAmenities(updatedAmenities)} // Cập nhật danh sách
        />

        {/* Price Range */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Price Range ($)
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              placeholder="Min"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-rose-500 focus:border-rose-500"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              placeholder="Max"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
        </div>
      </div>
    );
  }

  console.log(minPrice, maxPrice);

  return (
    <Modal
      isOpen={searchModel.isOpen}
      onClose={searchModel.onClose}
      onSubmit={onSubmit}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      secondaryActionLabel={secondActionLabel}
      title="Filters"
      actionLabel={actionLabel}
      body={bodyContent}
    />
  );
}

export default SearchModal;
