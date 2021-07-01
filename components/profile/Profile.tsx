import { useRouter } from "next/router";
import React from "react";
import useSWR  from "swr";

import ArticleList from "components/article/ArticleList";
import CustomLink from "components/common/CustomLink";
import CustomImage from "components/common/CustomImage";
import ErrorMessage from "components/common/ErrorMessage";
import LoadingSpinner from "components/common/LoadingSpinner";
import Maybe from "components/common/Maybe";
import EditProfileButton from "components/profile/EditProfileButton";
import FollowUserButton from "components/profile/FollowUserButton";
import { SERVER_BASE_URL } from "lib/utils/constant";
import fetcher from "lib/utils/fetcher";
import getLoggedInUser from "lib/utils/getLoggedInUser";

const ProfileHoc = (tab) => {
  return ({ profile }) => {
    const router = useRouter();
    if (router.isFallback) { return <LoadingSpinner />; }
    const { data: profileApi, error } = useSWR(`${SERVER_BASE_URL}/profiles/${profile.username}`, fetcher);
    if (profileApi !== undefined) {
      profile = profileApi.profile
    }
    const { username, bio, image } = profile;
    const loggedInUser = getLoggedInUser()
    const isCurrentUser = loggedInUser && username === loggedInUser?.username;
    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <CustomImage
                  src={image}
                  alt="User's profile image"
                  className="user-img"
                />
                <h4>{username}</h4>
                <p>{bio}</p>
                <EditProfileButton isCurrentUser={isCurrentUser} />
                <FollowUserButton profile={profile} />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <CustomLink
                      href="/profile/[pid]"
                      as={`/profile/${encodeURIComponent(username)}`}
                      className={`nav-link${tab === 'my-posts' ? ' active' : ''}`}
                    >
                      My Posts
                    </CustomLink>
                  </li>
                  <li className="nav-item">
                    <CustomLink
                      href="/profile/[pid]/favorites"
                      as={`/profile/${encodeURIComponent(username)}/favorites`}
                      className={`nav-link${tab === 'favorites' ? ' active' : ''}`}
                    >
                      Favorited Posts
                    </CustomLink>
                  </li>
                </ul>
              </div>
              <ArticleList what={tab} />
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default ProfileHoc;