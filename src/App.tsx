import React, {useEffect, useState} from 'react';
import CryptoItem from 'components/CryptoItem';
import 'App.css';

const App = () => {

    const [cryptoList, setCryptoList] = useState(['Dogecoin']);
    const [shouldListUpdate, setShouldListUpdate] = useState(false);
    const [cryptoInfo, setCryptoInfo] = useState<{[name: string]: {price: number, change: number}}>({});
    const [inputValue, setInputValue] = useState('');

    const updateInfo = () => {
        fetchCrypto().then(newInfo => setCryptoInfo(newInfo));
    }

    useEffect(() => {
        const timer = setInterval(() => setShouldListUpdate(true), 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (shouldListUpdate) {
            updateInfo();
            setShouldListUpdate(false);
        }
    }, [shouldListUpdate]);

    useEffect(() => {
        updateInfo();
    }, [cryptoList]);

    const fetchCrypto = async () => {
        const newInfo: typeof cryptoInfo = {};
        for (const name of cryptoList) {
            await fetch(`/crypto/${name}`)
                .then(res => res.json())
                .then(data => {
                    const info = {price: data['USD'], change: 0};
                    const prevInfo = cryptoInfo[name];
                    if (prevInfo) {
                        info.change = info.price - prevInfo.price;
                    }
                    newInfo[name] = info;
                });
        }
        return newInfo;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const value = inputValue.toLowerCase();
        if (cryptoList.includes(value)) {
            return;
        }
        await fetch(`/crypto/${value}`)
            .then(res => res.json())
            .then(res => {
                if (res?.Response !== 'Error') {
                    setCryptoList(prevList => [...prevList, value]);
                    setInputValue('');
                }
            });
    }

    const handleDelete = (name: string) => {
        setCryptoList(prevList => prevList.filter(n => n !== name));
    }

    return (
        <div className='app'>
            <input
                placeholder='search...'
                type="text"
                onChange={handleChange}
                value={inputValue}
            />
            <button
                onClick={handleClick}
            >Add
            </button>
            <div className="table-header">
                <span className="table-header__name">Name</span>
                <span className="table-header__price">USD</span>
            </div>
            <ul>
                {
                    Object.entries(cryptoInfo).map(([name, info]) => (
                        <CryptoItem
                            key={name}
                            name={name}
                            price={info.price}
                            change={info.change}
                            onDelete={() => handleDelete(name)}
                        />
                    ))
                }
            </ul>
        </div>
    );
}

export default App;
