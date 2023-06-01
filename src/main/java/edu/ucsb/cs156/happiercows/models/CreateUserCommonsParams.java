package edu.ucsb.cs156.happiercows.models;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.format.annotation.NumberFormat;

import org.springframework.security.core.GrantedAuthority;

import edu.ucsb.cs156.happiercows.entities.User;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class CreateUserCommonsParams {
  @NumberFormat
  private double totalWealth;
  @NumberFormat
  private int numOfCows;
  @NumberFormat
  private double cowHealth;
}
