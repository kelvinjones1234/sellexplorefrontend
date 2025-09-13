"use client"


import FloatingLabelInput from "@/app/component/fields/Input";
import React from "react";

const Search = () => {
  return (
    <div className="max-w-[700px] mx-auto px-4">
      <FloatingLabelInput
        type={"text"}
        name={"search field"}
        value={""}
        onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
          throw new Error("Function not implemented.");
        }}
        placeholder={"Search for items"}
      />
    </div>
  );
};

export default Search;
