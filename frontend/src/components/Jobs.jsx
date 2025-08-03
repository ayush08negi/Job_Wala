import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';


const Jobs = () => {
    const { allJobs, searchedQuery, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        const { Location, Industry, Salary } = searchedQuery;
    
        const filtered = allJobs.filter((job) => {
            const matchLocation = Location ? job?.location?.toLowerCase() === Location.toLowerCase() : true;
            const matchIndustry = Industry
            ? job?.title?.toLowerCase().includes(Industry.toLowerCase().split(' ')[0]) // match on keyword like "backend"
            : true;
          
    
            let matchSalary = true;
            if (Salary && job?.salary) {
                const salaryRange = Salary.replace("LPA", "").split("-").map(Number);
                const jobSalary = Number(job.salary);
                if (!isNaN(salaryRange[0]) && !isNaN(salaryRange[1])) {
                    matchSalary = jobSalary >= salaryRange[0] && jobSalary <= salaryRange[1];
                }
            }
    
            const matchSearch = searchJobByText
                ? job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                  job?.description?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                  job?.location?.toLowerCase().includes(searchJobByText.toLowerCase())
                : true;
    
            return matchLocation && matchIndustry && matchSalary && matchSearch;
        });
    
        setFilterJobs(filtered);
    }, [allJobs, searchedQuery, searchJobByText]);
    
    
    
    
      

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs