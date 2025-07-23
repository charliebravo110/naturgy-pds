import Result from './Restult';

interface Item {
    key: string;
    value: string;
}

interface MasterDataResult {
    items: Item[];
    language: 'ES' | 'EN' | 'GA';
    master: string;
    result: Result;
}

export default MasterDataResult;
