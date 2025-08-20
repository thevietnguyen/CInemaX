package com.cinemax.cinamaxbackend.service;

import com.cinemax.cinamaxbackend.dto.User.ChangePasswordDTO;
import com.cinemax.cinamaxbackend.dto.User.UpdateUserDTO;
import com.cinemax.cinamaxbackend.dto.User.UpdateUserRoleDTO;
import com.cinemax.cinamaxbackend.dto.User.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


public interface UserService{

//    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
    Page<UserDTO> getAllUsers(int page, int size);

    UserDTO getCurrentUserInfo();

    UserDTO updateCurrentUser(UpdateUserDTO updateUserDTO);
    UserDTO updateUserRole(Long id, UpdateUserRoleDTO updateUserRoleDTO);
    void changeCurrentUserPassword(ChangePasswordDTO changePasswordDTO);

    void deleteUser(Long id);
    Page<UserDTO> searchUsers(String query, int page, int size);
}
