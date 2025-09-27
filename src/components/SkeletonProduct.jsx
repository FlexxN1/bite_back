import React from "react";
import "../style/ProductList.scss";

const SkeletonProduct = () => {
    return (
        <div className="ProductItem skeleton">
            <div className="skeleton-img"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-text long"></div>
        </div>
    );
};

export default SkeletonProduct;
