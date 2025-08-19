import React from 'react';

const InventoryTable = ({ inventoryData }) => {
    const [sortConfig, setSortConfig] = React.useState(null);
    const [filteredData, setFilteredData] = React.useState(inventoryData);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    React.useEffect(() => {
        let sortedData = [...inventoryData];
        if (sortConfig !== null) {
            sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        setFilteredData(sortedData);
    }, [inventoryData, sortConfig]);

    return (
        <table>
            <thead>
                <tr>
                    <th onClick={() => requestSort('name')}>Product Name</th>
                    <th onClick={() => requestSort('quantity')}>Quantity</th>
                    <th onClick={() => requestSort('price')}>Price</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default InventoryTable;