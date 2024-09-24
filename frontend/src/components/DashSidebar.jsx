import React, { useEffect, useState } from 'react';
import { Sidebar, SidebarItem } from 'flowbite-react';
import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { HiDocumentText } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiAnnotation } from "react-icons/hi";
import { HiChartPie } from "react-icons/hi";




const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch()
  const {currentUser} = useSelector(state => state.user)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      })
      const data = await res.json()
      if(data.success === false){
        console.log(data.message)
      }
      if(res.ok){
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'ADMIN' : 'USER'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
          <Link to='/dashboard?tab=dashboard'>
            <Sidebar.Item
              active={tab === 'dashboard' || !'tab'}
              icon={HiChartPie}
              as='div'>
              Dashboard
            </Sidebar.Item>          
          
          </Link>
          )}

          {currentUser.isAdmin && (
          <Link to='/dashboard?tab=posts'>
            <Sidebar.Item
              active={tab === 'posts'}
              icon={HiDocumentText}
              as='div'>
              Posts
            </Sidebar.Item>          
          
          </Link>
          )}

          {currentUser.isAdmin && (
          <Link to='/dashboard?tab=users'>
            <Sidebar.Item
              active={tab === 'users'}
              icon={HiOutlineUserGroup}
              as='div'>
              Users
            </Sidebar.Item>          
          
          </Link>
          )}

          {currentUser.isAdmin && (
          <Link to='/dashboard?tab=comments'>
            <Sidebar.Item
              active={tab === 'comments'}
              icon={HiAnnotation}
              as='div'>
              Comments
            </Sidebar.Item>          
          
          </Link>
          )}

          <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
