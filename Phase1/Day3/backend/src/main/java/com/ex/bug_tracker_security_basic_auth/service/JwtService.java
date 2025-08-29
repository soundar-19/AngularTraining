package com.ex.bug_tracker_security_basic_auth.service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private static final String SECRET_BASE64 = "dGhpc2lzYXNlY3VyZWp3dHNlY3JldGtleWZvcnNwcmluZ2Jvb3RhcHBsaWNhdGlvbjEyMzQ1Njc4OTA=";
    private static final long EXPIRATION_MS = 150000;
    
    private Key getSigningKey(){
        byte[] keyBytes = Base64.getDecoder().decode(SECRET_BASE64);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    public String generateToken(String userName){
        return Jwts.builder()
        .setSubject(userName)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION_MS))
        .signWith(getSigningKey(),SignatureAlgorithm.HS256)
        .compact();
    }
    
    public String extractUserName(String token){
        return extractClaim(token, Claims::getSubject);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    private Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }
    
    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }
    
    public boolean validateToken(String token, String userName){
        final String extractedUserName = extractUserName(token);
        return (extractedUserName.equals(userName) && !isTokenExpired(token));
    }

    public boolean validateToken(String token, UserDetails userDetails){
        final String extractedUserName = extractUserName(token);
        return (extractedUserName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
