package edu.ucsb.cs156.happiercows.controllers;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;
import java.util.*;
import java.util.stream.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.models.CreateCommonsParams;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.controllers.ApiController;

@Slf4j
@Api(description = "Commons")
@RequestMapping("/api/commons")
@RestController
public class CommonsController extends ApiController {
  @Autowired
  private CommonsRepository commonsRepository;

  @Autowired
  private UserCommonsRepository userCommonsRepository;

  @Autowired
  ObjectMapper mapper;

  @ApiOperation(value = "Get a list of all commons")
  @GetMapping("/all")
  public ResponseEntity<String> getCommons() throws JsonProcessingException {
    log.info("getCommons()...");
    Iterable<Commons> commons = commonsRepository.findAll();
    String body = mapper.writeValueAsString(commons);
    return ResponseEntity.ok().body(body);
  }

  @ApiOperation(value = "Get a list of all commons and number of cows/users")
  @GetMapping("/allplus")
  public ResponseEntity<String> getCommonsPlus() throws JsonProcessingException {
    log.info("getCommonsPlus()...");
    Iterable<Commons> commonsListIter = commonsRepository.findAll();

    // convert Iterable to List for the purposes of using a Java Stream & lambda
    // below
    List<Commons> commonsList = new ArrayList<Commons>();
    commonsListIter.forEach(commonsList::add);

    List<CommonsPlus> commonsPlusList1 = commonsList.stream()
        .map(c -> toCommonsPlus(c))
        .collect(Collectors.toList());

    ArrayList<CommonsPlus> commonsPlusList = new ArrayList<CommonsPlus>(commonsPlusList1);

    String body = mapper.writeValueAsString(commonsPlusList);
    return ResponseEntity.ok().body(body);
  }

  @ApiOperation(value = "Update a commons")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PutMapping("/update")
  public ResponseEntity<String> updateCommons(
      @ApiParam("commons identifier") @RequestParam long id,
      @ApiParam("request body") @RequestBody CreateCommonsParams params) {
    Optional<Commons> existing = commonsRepository.findById(id);

    Commons updated;
    HttpStatus status;

    if (existing.isPresent()) {
      updated = existing.get();
      status = HttpStatus.NO_CONTENT;
    } else {
      updated = new Commons();
      status = HttpStatus.CREATED;
    }

    updated.setName(params.getName());
    updated.setCowPrice(params.getCowPrice());
    updated.setMilkPrice(params.getMilkPrice());
    updated.setStartingBalance(params.getStartingBalance());
    updated.setStartingDate(params.getStartingDate());
    updated.setScaleCowSalePrice(params.getScaleCowSalePrice());
    updated.setShowLeaderboard(params.getShowLeaderboard());
    updated.setDegradationRate(params.getDegradationRate());
    updated.setCarryingCapacity(params.getCarryingCapacity());

    if (params.getDegradationRate() < 0) {
      throw new IllegalArgumentException("Degradation Rate cannot be negative");
    }

    commonsRepository.save(updated);

    return ResponseEntity.status(status).build();
  }

  @ApiOperation(value = "Get a specific commons")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("")
  public Commons getCommonsById(
      @ApiParam("id") @RequestParam Long id) throws JsonProcessingException {

    Commons commons = commonsRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(Commons.class, id));

    return commons;
  }

  @ApiOperation(value = "Create a new commons")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping(value = "/new", produces = "application/json")
  public ResponseEntity<String> createCommons(

      @ApiParam("request body") @RequestBody CreateCommonsParams params) throws JsonProcessingException {
    Commons commons = Commons.builder()
        .name(params.getName())
        .cowPrice(params.getCowPrice())
        .milkPrice(params.getMilkPrice())
        .startingBalance(params.getStartingBalance())
        .startingDate(params.getStartingDate())
        .degradationRate(params.getDegradationRate())
        .scaleCowSalePrice(params.getScaleCowSalePrice())
        .showLeaderboard(params.getShowLeaderboard())
        .carryingCapacity(params.getCarryingCapacity())
        .build();

    // throw exception for degradation rate
    if (params.getDegradationRate() < 0) {
      throw new IllegalArgumentException("Degradation Rate cannot be negative");
    }

    Commons saved = commonsRepository.save(commons);
    String body = mapper.writeValueAsString(saved);

    return ResponseEntity.ok().body(body);
  }

  @ApiOperation(value = "Join a commons")
  @PreAuthorize("hasRole('ROLE_USER')")
  @PostMapping(value = "/join", produces = "application/json")
  public ResponseEntity<String> joinCommon(
    @ApiParam("commonsId") @RequestParam Long commonsId) throws Exception {

    User u = getCurrentUser().getUser();
    Long userId = u.getId();
    String username = u.getFullName();

    Commons joinedCommons = commonsRepository.findById(commonsId)
        .orElseThrow(() -> new EntityNotFoundException(Commons.class, commonsId));
    Optional<UserCommons> userCommonsLookup = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);

    if (userCommonsLookup.isPresent()) {
      // user is already a member of this commons
      String body = mapper.writeValueAsString(joinedCommons);
      return ResponseEntity.ok().body(body);
    }

    UserCommons uc = UserCommons.builder()
        .commonsId(commonsId)
        .userId(userId)
        .username(username)
        .totalWealth(joinedCommons.getStartingBalance())
        .numOfCows(0)
        .cowHealth(100)
        .totalCowsBought(0)
        .totalCowsSold(0)
        .build();

    userCommonsRepository.save(uc);

    String body = mapper.writeValueAsString(joinedCommons);
    return ResponseEntity.ok().body(body);
  }

  @ApiOperation(value = "Delete a Commons")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("")
  public Object deleteCommons(
      @ApiParam("id") @RequestParam Long id) {

    Commons foundCommons = commonsRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(Commons.class, id));

    commonsRepository.deleteById(id);
    userCommonsRepository.deleteAllByCommonsId(id);

    String responseString = String.format("commons with id %d deleted", id);

    return genericMessage(responseString);

  }

  @ApiOperation("Delete a user from a commons")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("/{commonsId}/users/{userId}")
  public ResponseEntity<Commons> deleteUserFromCommon(@PathVariable("commonsId") Long commonsId,
      @PathVariable("userId") Long userId) throws Exception {

    Optional<UserCommons> uc = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);
    UserCommons userCommons = uc.orElseThrow(() -> new Exception(
        String.format("UserCommons with commonsId=%d and userId=%d not found.", commonsId, userId)));

    userCommonsRepository.deleteById(userCommons.getId());
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  public CommonsPlus toCommonsPlus(Commons c) {
    Optional<Integer> numCows = commonsRepository.getNumCows(c.getId());
    Optional<Integer> numUsers = commonsRepository.getNumUsers(c.getId());

    return CommonsPlus.builder()
        .commons(c)
        .totalCows(numCows.orElse(0))
        .totalUsers(numUsers.orElse(0))
        .build();
  }
}
