package maroon.auth.service;

import maroon.auth.base.Role;
import maroon.auth.base.User;
import maroon.auth.repository.UserRepository;
import maroon.auth.repository.RoleRepository;
import maroon.auth.service.UserService;

import java.util.Arrays;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public void saveUser(User user) {
        String hash = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(hash);
        user.setPasswordConfirm(hash);
        Role userRole = roleRepository.findByRole("USER");
        user.setRoles(new HashSet<>(Arrays.asList(userRole)));
        userRepository.save(user);
    }
    
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
}