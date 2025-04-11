import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import axios from 'axios';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

    // Fetch bookmarked jobs
    const fetchBookmarks = async () => {
        try {
            const res = await axios.get("/api/user/bookmarks");
            setBookmarkedJobs(res.data.bookmarkedJobs || []);
        } catch (error) {
            console.log("Error fetching bookmarks", error);
        }
    };

    useEffect(() => {
        fetchBookmarks();
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, []);

    // Get the bookmarked job IDs
    const bookmarkedIds = bookmarkedJobs.map(job => job._id);

    // Filter rest of the jobs
    const remainingJobs = allJobs.filter(job => !bookmarkedIds.includes(job._id));

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>
                    Search Results ({bookmarkedJobs.length + remainingJobs.length})
                </h1>

                <div className='grid grid-cols-3 gap-4'>
                    {/* Bookmarked Jobs */}
                    {bookmarkedJobs.length > 0 && (
                        <>
                            {bookmarkedJobs.map((job) => (
                                <Job key={job._id} job={job} isBookmarked={true} />
                            ))}
                        </>
                    )}

                    {/* Non-Bookmarked Jobs */}
                    {remainingJobs.map((job) => (
                        <Job key={job._id} job={job} isBookmarked={false} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Browse;
