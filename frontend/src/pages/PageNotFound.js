import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();
    const HOME_PAGE_URL = process.env.REACT_APP_HOME_PAGE_URL ?? "/";

    useEffect(() => {
        navigate(HOME_PAGE_URL)
    }, [navigate, HOME_PAGE_URL])

    return (
        <h1>Page not Found</h1>
    )
};

export default PageNotFound;
