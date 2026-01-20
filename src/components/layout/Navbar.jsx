import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import SearchBar from './SearchBar';

const Navbar = ({ onSearch }) => {

    return (
        <div>
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold">
                            <Link
                                to='/dashboard'
                                className="text-blue-600 no-underline"
                            >Quiz App
                            </Link></h1>
                        
                        <div className="flex items-center gap-20">
                            <SearchBar onSearch={onSearch} />
                            <Dropdown />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )

}
export default Navbar

