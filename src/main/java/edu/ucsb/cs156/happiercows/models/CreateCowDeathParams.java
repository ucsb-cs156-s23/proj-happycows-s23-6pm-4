package edu.ucsb.cs156.happiercows.models;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Collection;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.format.annotation.NumberFormat;
import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.security.core.GrantedAuthority;

import edu.ucsb.cs156.happiercows.entities.User;

@Data
@AllArgsConstructor
@NoArgsConstructor (access = AccessLevel.PROTECTED)
@Builder
public class CreateCowDeathParams {
  @DateTimeFormat
  private LocalDateTime zonedDateTime;
  @NumberFormat
  private Integer cowsKilled;
  @NumberFormat
  private double avgHealth;
 
  public LocalDateTime getZonedDateTime() {
    return zonedDateTime;
  }

  public Integer getcowsKilled() {
    return cowsKilled;
  }

  public double getavgHealth() {
    return avgHealth;
  }

}
