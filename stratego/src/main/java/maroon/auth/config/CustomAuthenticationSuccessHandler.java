package maroon.auth.config;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
		
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth)
			throws IOException, ServletException {
            response.setStatus(HttpServletResponse.SC_OK);
            
            for (GrantedAuthority authorities : auth.getAuthorities()){
                if("USER".equals(authorities.getAuthority())){
                    response.sendRedirect("/menu");
                }
            }
	}
 
}