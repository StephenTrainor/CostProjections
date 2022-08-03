import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { pagesConstants, errorConstants } from '../AppConstants';

const PageNotFound = () => {
    const navigate = useNavigate();
    const { INDEX_PAGE_URL } = pagesConstants;
    const { pageNotFoundErrorText } = errorConstants.errorMessages;

    useEffect(() => {
        navigate(INDEX_PAGE_URL)
    }, [navigate, INDEX_PAGE_URL])

    return (
        <h1>{pageNotFoundErrorText}</h1>
    );
};

export default PageNotFound;
