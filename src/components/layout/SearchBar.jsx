import { useState } from 'react';
import Input from '../common/Input';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="relative w-full md:w-64 ">
            <Input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    onSearch?.(value);
                }}
                className="pl-10 pr-4 py-2"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
    );
};

export default SearchBar;
