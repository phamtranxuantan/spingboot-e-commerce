import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GET_ALL } from "../../api/apiService";
import startsActive from "../../assets/images/icons/stars-active.svg";
import startsDisable from "../../assets/images/icons/starts-disable.svg";

const cardTextStyle = { maxWidth: "80%" };

const Section = ({ categoryName, categoryId }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!categoryId) {
            console.error('categoryId is undefined');
            return;
        }

        const params = {
            pageNumber: 0,
            pageSize: 5,
            sortBy: 'productId',
            sortOrder: 'asc',
        };
        GET_ALL(`categories/${categoryId}/products`, params)
            .then(response => {
                setProducts(response.content); // Set the products state
            })
            .catch(error => {
                console.error('Failed to fetch products:', error); // Handle errors
            });
    }, [categoryId]);

    return (
        <section className="padding-bottom">
            <header className="section-heading mb-4">
                <h3 className="title-section">{categoryName}</h3>
            </header>
            <div className="row">
                {products.length > 0 &&
                    products.map((row) => (
                        <div className="col-xl-3 col-lg-3 col-md-4 col-6" key={row.productId}>
                            <div className="card card-product-grid">
                                <Link to={`/Detail/${row.productId}`} className="img-wrap">
                                    <img src={` ${row.imageProduct}`} alt={row.productName} />
                                </Link>
                                <figcaption className="info-wrap">
                                    <ul className="rating-stars mb-1">
                                        <li style={{ cardTextStyle }} className="stars-active">
                                            <img src={startsActive} alt="" />
                                        </li>
                                        <li>
                                            <img src={startsDisable} alt="" />
                                        </li>
                                    </ul>
                                    <div>
                                        <Link to={`/Detail/${row.productId}`} className="title">
                                            {row.productName}
                                        </Link>
                                    </div>
                                    <div className="price h5 mt-2">{row.price} đ</div>
                                </figcaption>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
};

export default Section;