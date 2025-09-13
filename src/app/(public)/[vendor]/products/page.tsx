import React from "react";
import AllProducts from "./components/AllProduct";
import Search from "../../components/Search";

const AllItemsPage = () => {
  return (
    <div className="mt-[8rem] lg:mt-[10rem]">
      <div className="bg-[var(--color-border-secondary)] py-[1rem]">
        <Search />
      </div>
      <AllProducts />
    </div>
  );
};

export default AllItemsPage;
