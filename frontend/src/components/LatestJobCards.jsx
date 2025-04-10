import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage } from './ui/avatar'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const getShortDescription = (text) => {
        const words = text?.split(" ");
        return words?.slice(0, 50).join(" ") + (words?.length > 50 ? "..." : "");
    };

    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer overflow-hidden min-h-[300px] '
        >
            <div className='flex items-center gap-3 mb-3'>
                <Avatar className="h-12 w-12">
                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                </Avatar>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div className='mt-2'>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>
                    {getShortDescription(job?.description)}
                    {job?.description?.split(" ").length > 50 && (
                        <span
                            onClick={(e) => {
                                e.stopPropagation(); 
                                navigate(`/description/${job._id}`);
                            }}
                            className="text-blue-500 font-semibold ml-1 hover:underline"
                        >
                            Read More
                        </span>
                    )}
                </p>
            </div>

            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards
