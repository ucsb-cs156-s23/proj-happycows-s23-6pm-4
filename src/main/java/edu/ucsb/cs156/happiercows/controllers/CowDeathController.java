package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.entities.CowDeath;
import edu.ucsb.cs156.happiercows.repositories.CowDeathRepository;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.errors.NoCowsException;  
import edu.ucsb.cs156.happiercows.models.CurrentUser;
import edu.ucsb.cs156.happiercows.entities.Profit;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.models.CreateCowDeathParams;

import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;

import java.time.ZonedDateTime;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Slf4j
@Api(description = "CowDeath")
@RequestMapping("/api/cowdeath")
@RestController

public class CowDeathController extends ApiController {

    @Autowired
    CommonsRepository commonsRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    @Autowired
    CowDeathRepository cowDeathRepository;

    @Autowired
    ObjectMapper mapper;

    @ApiOperation(value = "Takes a commonsId and lists all cow casualities for that commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/bycommons")
    public Iterable<CowDeath> allCowDeathbyCommonsId(
            @ApiParam("commonsId") @RequestParam Long commonsId) {
        
        List<UserCommons> userCommonsList = new ArrayList<>();
        userCommonsRepository.findByCommonsId(commonsId).forEach(userCommonsList::add);

        if (userCommonsList.isEmpty()) {
        throw new EntityNotFoundException(UserCommons.class,"commonsId");
        }

        UserCommons userCommons = userCommonsList.get(0);
        Iterable<CowDeath> allCowDeathbyCommonsId = cowDeathRepository.findAllByUserCommons_Id(userCommons.getId());

        List<CowDeath> savedCowDeaths = new ArrayList<>();
        allCowDeathbyCommonsId.forEach(cowDeath -> savedCowDeaths.add(cowDeathRepository.save(cowDeath)));

        return savedCowDeaths;
    }

    
    
}

