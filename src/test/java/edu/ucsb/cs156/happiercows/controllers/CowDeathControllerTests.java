package edu.ucsb.cs156.happiercows.controllers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.ZonedDateTime;
import org.junit.jupiter.api.Assertions;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.test.web.servlet.MockMvc;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.Commons;

import edu.ucsb.cs156.happiercows.entities.CowDeath;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.models.CreateCowDeathParams;
import edu.ucsb.cs156.happiercows.repositories.CowDeathRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import static org.mockito.ArgumentMatchers.*;

@WebMvcTest(controllers = CowDeathController.class)
@AutoConfigureDataJpa
public class CowDeathControllerTests extends ControllerTestCase{
    
    @Autowired
    private MockMvc mockMvc;

   @MockBean
   UserCommonsRepository userCommonsRepository;

   @MockBean
   UserRepository userRepository;

   @MockBean
   CommonsRepository commonsRepository;

   @MockBean
   CowDeathRepository cowDeathRepository;

   @Autowired
   private ObjectMapper objectMapper;
    
    @WithMockUser(roles = {"ADMIN"})
    @Test
    
    public void testCreateCowDeath() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        CreateCowDeathParams params = CreateCowDeathParams.builder()
            .zonedDateTime(now)
            .cowsKilled(10)
            .avgHealth(75)
            .build();
      
        String requestBody = objectMapper.writeValueAsString(params);
        //String expectedResponse = objectMapper.writeValueAsString(savedCowDeath);

        CowDeath savedCowDeath = CowDeath.builder()
            .zonedDateTime(now)
            .cowsKilled(10)
            .avgHealth(75)
            .build();
       
   
        CowDeath expectedResponse = CowDeath.builder()
            .id(1L)
            .commonsId(0L)
            .userId(0L)
            .zonedDateTime(now)
            .cowsKilled(10)
            .avgHealth(75)
            .build();
        expectedResponse.setId(1L);
        expectedResponse.setCommonsId(0L);
        expectedResponse.setUserId(0L);

        when(cowDeathRepository.save(any(CowDeath.class)))
        .thenReturn(expectedResponse);

        MvcResult response = mockMvc
            .perform(post("/api/cowdeath").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("utf-8")
                .content(requestBody))
            .andExpect(status().isOk())
            .andReturn();

        verify(cowDeathRepository, times(1)).save(any(CowDeath.class));

        String actualResponse = response.getResponse().getContentAsString();
        String expectedResponseJson = objectMapper.writeValueAsString(expectedResponse);
        assertEquals(expectedResponseJson, actualResponse);
    }
  


 @Test
    public void testGetZonedDateTime() {
        CowDeath cowDeath = CowDeath.builder().build();

        cowDeath.setZonedDateTime(null);
        
        Assertions.assertNull(cowDeath.getZonedDateTime());
    }

    @Test
    public void testGetCowsKilled() {
        CowDeath cowDeath = CowDeath.builder().build();

        cowDeath.setCowsKilled(0);

        assertEquals(0, cowDeath.getCowsKilled());
    }

    @Test
    public void testGetAvgHealth() {
        CowDeath cowDeath = CowDeath.builder().build();

        cowDeath.setAvgHealth(0.0);

        assertEquals(0.0, cowDeath.getAvgHealth(), 0.001); 
    }


    @Test
    public void testSetZonedDateTime() {
        CowDeath cowDeath = CowDeath.builder().build();

        LocalDateTime dateTime = LocalDateTime.of(2023, 6, 5, 12, 0);
        cowDeath.setZonedDateTime(dateTime);

        assertEquals(dateTime, cowDeath.getZonedDateTime());
    }

    @Test
    public void testSetCowsKilled() {
        CowDeath cowDeath = CowDeath.builder().build();
        int cowsKilled = 5;
        cowDeath.setCowsKilled(cowsKilled);

        assertEquals(cowsKilled, cowDeath.getCowsKilled());
    }

    @Test
    public void testSetAvgHealth() {
        CowDeath cowDeath = CowDeath.builder().build();

        double avgHealth = 3.5;
        cowDeath.setAvgHealth(avgHealth);

        assertEquals(avgHealth, cowDeath.getAvgHealth(), 0.001); 
    }

    @Test
    public void testCreateCowDeathParamsGetters() {
        CreateCowDeathParams params = CreateCowDeathParams.builder().build();
        
        params.setZonedDateTime(null);
        params.setCowsKilled(null);
        params.setAvgHealth(Double.NaN);

        Assertions.assertNull(params.getZonedDateTime());
        Assertions.assertNull(params.getCowsKilled());
        Assertions.assertTrue(Double.isNaN(params.getAvgHealth()));
    }

    @Test
    public void newtestGetZonedDateTime() {
        LocalDateTime dateTime = LocalDateTime.now();
        CreateCowDeathParams params = CreateCowDeathParams.builder()
            .zonedDateTime(dateTime)
            .build();

        assertEquals(dateTime, params.getZonedDateTime());
    }
}
