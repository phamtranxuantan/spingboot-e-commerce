import React from "react";
import {
    Image,
    Text,
    View,
    Page,
    Document,
    StyleSheet,
} from "@react-pdf/renderer";
import logo from './img/LogoHITC.png';

interface Product {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}

interface DocumentData {
    cartId: string;
    totalPrice: number;
    products: Product[];
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    section: {
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        padding: 5,
    },
    tableCell: {
        margin: 'auto',
        marginTop: 5,
        fontSize: 10,
    },
});

const MyDocument = ({ data }: { data: DocumentData }) => {
    const { cartId, totalPrice, products } = data;

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.header}>Cart Details</Text>
                </View>
                <View style={styles.section}>
                    <Text>Cart ID: {cartId}</Text>
                    <Text>Total Price: ${totalPrice}</Text>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Product ID</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Product Name</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Quantity</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Price</Text>
                        </View>
                    </View>
                    {products.map((product) => (
                        <View style={styles.tableRow} key={product.productId}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{product.productId}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{product.productName}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{product.quantity}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>${product.price}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default MyDocument;
