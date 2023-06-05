package edu.ucsb.cs156.happiercows.controllers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.ZonedDateTime;

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
  
}


